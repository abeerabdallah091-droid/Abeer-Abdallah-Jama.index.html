#!/usr/bin/env python3
"""Read a single prospect row from Google Sheets and output JSON to stdout."""

import argparse
import json
import os
import re
import sys

# Column name aliases (case-insensitive)
COLUMN_MAP = {
    "company_name": "company",
    "company": "company",
    "description": "description",
    "about": "description",
    "keywords": "services",
    "services": "services",
    "phone": "phone",
    "phone_number": "phone",
    "email": "email",
    "contact_email": "email",
    "address": "address",
    "full_address": "address",
    "city": "city",
    "state": "state",
    "country": "country",
    "industry": "industry",
    "category": "industry",
    "first_name": "first_name",
    "last_name": "last_name",
    "title": "title",
    "role": "title",
    "website": "website",
}


def get_sheets_service():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    creds = None

    token_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "token.json")
    creds_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "credentials.json")

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(creds_path):
                print(
                    "ERROR: credentials.json not found. Download it from Google Cloud Console.",
                    file=sys.stderr,
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as token:
            token.write(creds.to_json())

    return build("sheets", "v4", credentials=creds)


def extract_spreadsheet_id(url: str) -> str:
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url)
    if not match:
        print(f"ERROR: Could not extract spreadsheet ID from URL: {url}", file=sys.stderr)
        sys.exit(1)
    return match.group(1)


def normalize_headers(headers: list) -> dict:
    """Return {normalized_col_name: column_index} mapping."""
    result = {}
    for i, h in enumerate(headers):
        key = h.strip().lower().replace(" ", "_")
        canonical = COLUMN_MAP.get(key, key)
        if canonical not in result:
            result[canonical] = i
    return result


def read_prospect(url: str, row: int, worksheet: str | None = None) -> dict:
    service = get_sheets_service()
    spreadsheet_id = extract_spreadsheet_id(url)

    # Determine sheet name
    if not worksheet:
        meta = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        worksheet = meta["sheets"][0]["properties"]["title"]

    range_name = f"'{worksheet}'!A1:Z{row + 1}"
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    values = result.get("values", [])

    if len(values) < 2:
        print("ERROR: Sheet has fewer rows than requested.", file=sys.stderr)
        sys.exit(1)

    headers = normalize_headers(values[0])
    data_row = values[row] if row < len(values) else []

    # Pad row if shorter than headers
    while len(data_row) < len(values[0]):
        data_row.append("")

    prospect = {}
    for canonical, idx in headers.items():
        prospect[canonical] = data_row[idx] if idx < len(data_row) else ""

    return prospect


def main():
    parser = argparse.ArgumentParser(description="Read a prospect row from Google Sheets.")
    parser.add_argument("--url", required=True, help="Google Sheets URL")
    parser.add_argument("--row", type=int, required=True, help="Row number (1-indexed, excluding header)")
    parser.add_argument("--worksheet", default=None, help="Worksheet/tab name (optional)")
    args = parser.parse_args()

    prospect = read_prospect(args.url, args.row, args.worksheet)
    print(json.dumps(prospect, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
