#!/usr/bin/env python3
"""Generate a premium HTML mockup website from prospect JSON (stdin or file)."""

import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path


UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
OUTPUT_DIR = Path(".tmp")

COLORS = {
    "bg": "#F2EFE6",
    "black": "#000000",
    "white": "#FFFFFF",
    "terracotta": "#C38133",
    "gray": "#6B6B6B",
    "light": "#E8E4D9",
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text


def esc(text: str) -> str:
    return html.escape(str(text or ""))


def get_unsplash_url(query: str, width: int = 1200, height: int = 800) -> str:
    if UNSPLASH_KEY:
        encoded = urllib.parse.quote(query)
        return f"https://api.unsplash.com/photos/random?query={encoded}&w={width}&h={height}&client_id={UNSPLASH_KEY}&auto=format&fit=crop"
    # Fallback: picsum with a seed derived from query
    seed = abs(hash(query)) % 1000
    return f"https://picsum.photos/seed/{seed}/{width}/{height}"


def resolve_unsplash(query: str, width: int = 1200, height: int = 800) -> str:
    """Return a direct image URL (follow redirect if Unsplash API)."""
    url = get_unsplash_url(query, width, height)
    if not UNSPLASH_KEY:
        return url
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read())
            return data["urls"]["regular"]
    except Exception:
        seed = abs(hash(query)) % 1000
        return f"https://picsum.photos/seed/{seed}/{width}/{height}"


def parse_services(raw: str) -> list[str]:
    if not raw:
        return ["Our Services", "Expertise", "Solutions"]
    parts = [s.strip() for s in re.split(r"[,;|]+", raw) if s.strip()]
    return parts[:6] if parts else ["Our Services"]


def build_html(p: dict) -> str:
    company = esc(p.get("company") or "Your Company")
    description = esc(p.get("description") or "We deliver exceptional results.")
    services = parse_services(p.get("services", ""))
    phone = esc(p.get("phone", ""))
    email = esc(p.get("email", ""))
    address = esc(p.get("address", ""))
    city = esc(p.get("city", ""))
    state = esc(p.get("state", ""))
    country = esc(p.get("country", ""))
    industry = p.get("industry") or p.get("category") or "business architecture"
    first = esc(p.get("first_name", ""))
    last = esc(p.get("last_name", ""))
    owner = f"{first} {last}".strip()
    role = esc(p.get("title") or "Founder")
    year = datetime.now().year

    location_parts = [x for x in [city, state, country] if x]
    location = ", ".join(location_parts)

    hero_img = resolve_unsplash(f"{industry} workspace interior", 1400, 900)
    about_img = resolve_unsplash(f"{industry} professional team", 800, 600)
    gallery_imgs = [
        resolve_unsplash(f"{industry} detail", 600, 400),
        resolve_unsplash(f"{industry} project", 600, 400),
        resolve_unsplash(f"{industry} office", 600, 400),
        resolve_unsplash(f"{industry} work", 600, 400),
    ]

    services_html = ""
    for svc in services:
        services_html += f"""
        <div class="service-card">
          <div class="service-number">0{services.index(svc)+1}</div>
          <h3 class="service-title">{esc(svc)}</h3>
          <p class="service-desc">We bring deep expertise and a tailored approach to every {esc(svc).lower()} engagement.</p>
        </div>"""

    gallery_html = "".join(
        f'<div class="gallery-item"><img src="{g}" alt="Gallery" loading="lazy"></div>'
        for g in gallery_imgs
    )

    contact_items = ""
    if phone:
        contact_items += f'<p class="contact-item"><span class="contact-label">PHONE</span><a href="tel:{phone}">{phone}</a></p>'
    if email:
        contact_items += f'<p class="contact-item"><span class="contact-label">EMAIL</span><a href="mailto:{email}">{email}</a></p>'
    if address:
        contact_items += f'<p class="contact-item"><span class="contact-label">ADDRESS</span>{address}</p>'
    if location:
        contact_items += f'<p class="contact-item"><span class="contact-label">LOCATION</span>{location}</p>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{company}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

    :root {{
      --bg: {COLORS["bg"]};
      --black: {COLORS["black"]};
      --white: {COLORS["white"]};
      --terracotta: {COLORS["terracotta"]};
      --gray: {COLORS["gray"]};
      --light: {COLORS["light"]};
      --space: 8px;
    }}

    html {{ scroll-behavior: smooth; }}
    body {{ font-family: 'Inter', sans-serif; background: var(--bg); color: var(--black); line-height: 1.5; overflow-x: hidden; }}

    /* NAV */
    nav {{
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 48px;
      background: rgba(242,239,230,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }}
    .nav-logo {{ font-size: 14px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }}
    .nav-links {{ display: flex; gap: 32px; }}
    .nav-links a {{ font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; color: var(--black); opacity: 0.6; transition: opacity .2s; }}
    .nav-links a:hover {{ opacity: 1; }}
    .nav-cta {{ font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; color: var(--black); border: 1.5px solid var(--black); padding: 10px 22px; transition: background .2s, color .2s; }}
    .nav-cta:hover {{ background: var(--black); color: var(--white); }}

    /* HERO */
    .hero {{
      height: 100vh; min-height: 700px;
      display: grid; grid-template-columns: 1fr 1fr;
      padding-top: 80px;
    }}
    .hero-text {{
      display: flex; flex-direction: column; justify-content: center;
      padding: 80px 64px;
    }}
    .hero-eyebrow {{ font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 24px; }}
    .hero-title {{
      font-size: clamp(52px, 6vw, 88px); font-weight: 900; line-height: 1.0;
      text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 32px;
    }}
    .hero-sub {{ font-size: 17px; font-weight: 400; color: var(--gray); max-width: 420px; line-height: 1.7; margin-bottom: 48px; }}
    .hero-actions {{ display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }}
    .btn-primary {{
      display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; text-decoration: none;
      background: var(--black); color: var(--white);
      padding: 16px 36px; transition: background .2s;
    }}
    .btn-primary:hover {{ background: var(--terracotta); }}
    .btn-secondary {{
      display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; text-decoration: none;
      color: var(--black); border-bottom: 1.5px solid var(--black);
      padding-bottom: 2px; transition: color .2s, border-color .2s;
    }}
    .btn-secondary:hover {{ color: var(--terracotta); border-color: var(--terracotta); }}
    .hero-image {{ position: relative; overflow: hidden; }}
    .hero-image img {{ width: 100%; height: 100%; object-fit: cover; }}
    .hero-image-overlay {{
      position: absolute; bottom: 32px; left: 32px;
      background: rgba(242,239,230,0.92); padding: 16px 24px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    }}

    /* MARQUEE */
    .marquee-strip {{
      background: var(--black); color: var(--white);
      padding: 16px 0; overflow: hidden; white-space: nowrap;
    }}
    .marquee-inner {{ display: inline-flex; gap: 48px; animation: marquee 20s linear infinite; }}
    .marquee-inner span {{ font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }}
    .marquee-inner .dot {{ color: var(--terracotta); }}
    @keyframes marquee {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }}

    /* ABOUT */
    .about {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 120px 0; }}
    .about-image {{ position: relative; overflow: hidden; min-height: 560px; }}
    .about-image img {{ width: 100%; height: 100%; object-fit: cover; }}
    .about-content {{ padding: 80px 64px; display: flex; flex-direction: column; justify-content: center; }}
    .section-label {{ font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 24px; }}
    .section-title {{ font-size: clamp(32px, 3.5vw, 52px); font-weight: 800; line-height: 1.1; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 32px; }}
    .about-body {{ font-size: 16px; color: var(--gray); line-height: 1.8; margin-bottom: 40px; max-width: 480px; }}
    .about-stat {{ display: flex; gap: 48px; margin-top: 16px; }}
    .stat-num {{ font-size: 40px; font-weight: 900; line-height: 1; }}
    .stat-label {{ font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray); margin-top: 4px; }}

    /* SERVICES */
    .services {{ padding: 120px 64px; background: var(--white); }}
    .services-header {{ display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 64px; }}
    .services-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--light); }}
    .service-card {{ background: var(--white); padding: 48px 36px; transition: background .2s; }}
    .service-card:hover {{ background: var(--bg); }}
    .service-number {{ font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: var(--terracotta); margin-bottom: 24px; }}
    .service-title {{ font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px; }}
    .service-desc {{ font-size: 14px; color: var(--gray); line-height: 1.7; }}

    /* GALLERY */
    .gallery {{ display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 360px 360px; }}
    .gallery-item {{ overflow: hidden; }}
    .gallery-item img {{ width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }}
    .gallery-item:hover img {{ transform: scale(1.04); }}

    /* CONTACT */
    .contact {{ display: grid; grid-template-columns: 1fr 1fr; padding: 120px 0; gap: 0; }}
    .contact-left {{ padding: 80px 64px; background: var(--black); color: var(--white); display: flex; flex-direction: column; justify-content: center; }}
    .contact-left .section-label {{ color: var(--terracotta); }}
    .contact-left .section-title {{ color: var(--white); }}
    .contact-right {{ padding: 80px 64px; display: flex; flex-direction: column; justify-content: center; gap: 32px; }}
    .contact-item {{ display: flex; flex-direction: column; gap: 4px; }}
    .contact-label {{ font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terracotta); }}
    .contact-item a, .contact-item p {{ font-size: 15px; font-weight: 500; color: var(--black); text-decoration: none; }}
    .contact-item a:hover {{ color: var(--terracotta); }}

    /* FOOTER */
    footer {{
      background: var(--black); color: var(--white);
      padding: 32px 64px;
      display: flex; align-items: center; justify-content: space-between;
      font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    }}
    footer span {{ opacity: 0.4; }}
    .footer-brand {{ font-weight: 800; letter-spacing: 0.15em; }}

    @media (max-width: 900px) {{
      nav {{ padding: 20px 24px; }}
      .nav-links {{ display: none; }}
      .hero {{ grid-template-columns: 1fr; height: auto; }}
      .hero-text {{ padding: 48px 24px; }}
      .hero-image {{ height: 50vw; }}
      .about, .contact {{ grid-template-columns: 1fr; }}
      .about-content, .contact-left, .contact-right {{ padding: 48px 24px; }}
      .services {{ padding: 80px 24px; }}
      .services-header {{ flex-direction: column; gap: 16px; align-items: flex-start; }}
      .services-grid {{ grid-template-columns: 1fr; }}
      .gallery {{ grid-template-columns: 1fr; grid-template-rows: repeat(4, 260px); }}
      footer {{ padding: 24px; flex-direction: column; gap: 12px; text-align: center; }}
    }}
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <div class="nav-logo">{company}</div>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </div>
    <a href="#contact" class="nav-cta">Get in Touch</a>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-text">
      <div class="hero-eyebrow">{esc(industry.title()) if industry else "Professional Services"}</div>
      <h1 class="hero-title">{company}</h1>
      <p class="hero-sub">{description}</p>
      <div class="hero-actions">
        <a href="#services" class="btn-primary">Our Services</a>
        <a href="#about" class="btn-secondary">Learn More</a>
      </div>
    </div>
    <div class="hero-image">
      <img src="{hero_img}" alt="{company}">
      <div class="hero-image-overlay">{location if location else "Est. " + str(year)}</div>
    </div>
  </section>

  <!-- MARQUEE -->
  <div class="marquee-strip">
    <div class="marquee-inner">
      {"".join(f'<span>{esc(s)}</span><span class="dot">✦</span>' for s in (services * 6))}
      {"".join(f'<span>{esc(s)}</span><span class="dot">✦</span>' for s in (services * 6))}
    </div>
  </div>

  <!-- ABOUT -->
  <section class="about" id="about">
    <div class="about-image">
      <img src="{about_img}" alt="About {company}">
    </div>
    <div class="about-content">
      <div class="section-label">About Us</div>
      <h2 class="section-title">Who We Are</h2>
      <p class="about-body">{description} {"— " + owner + ", " + role if owner else ""}</p>
      <div class="about-stat">
        <div>
          <div class="stat-num">10+</div>
          <div class="stat-label">Years Experience</div>
        </div>
        <div>
          <div class="stat-num">{len(services)}+</div>
          <div class="stat-label">Core Services</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="services" id="services">
    <div class="services-header">
      <div>
        <div class="section-label">What We Do</div>
        <h2 class="section-title">Our Services</h2>
      </div>
      <a href="#contact" class="btn-secondary">Work With Us</a>
    </div>
    <div class="services-grid">
      {services_html}
    </div>
  </section>

  <!-- GALLERY -->
  <div class="gallery">
    {gallery_html}
  </div>

  <!-- CONTACT -->
  <section class="contact" id="contact">
    <div class="contact-left">
      <div class="section-label">Get in Touch</div>
      <h2 class="section-title">Let's Work Together</h2>
      <p style="font-size:16px; line-height:1.8; opacity:0.7; margin-top:16px; max-width:400px;">
        Ready to take your business to the next level? Reach out and let's discuss how we can help you achieve your goals.
      </p>
    </div>
    <div class="contact-right">
      {contact_items if contact_items else '<p style="color:var(--gray)">Contact details coming soon.</p>'}
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-brand">{company}</div>
    <span>&copy; {year} {company}. All rights reserved.</span>
  </footer>

</body>
</html>"""


def main():
    try:
        raw = sys.stdin.read()
        prospect = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    company_slug = slugify(prospect.get("company") or "prospect")
    output_path = OUTPUT_DIR / f"website_{company_slug}.html"

    html_content = build_html(prospect)
    output_path.write_text(html_content, encoding="utf-8")

    print(f"Generated: {output_path}", file=sys.stderr)
    print(str(output_path))


if __name__ == "__main__":
    main()
