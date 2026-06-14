# Single-File Creator Storefront — Build Guide

## What this is
A pattern for building polished product storefronts in the style of Stan Store. Products are the hero — visitors arrive from a social media bio link, see products immediately, tap a card, and order. Everything lives in one `.html` file: CSS, HTML, JS. No build tools, no frameworks.

---

## Stan Store Philosophy (the structure to follow)

Stan Store's structure works because it removes friction between "I saw this on TikTok" and "I just ordered."

| Principle | What it means in practice |
|---|---|
| Products first | No full-screen hero. Brand header is compact. Products appear above the fold. |
| One action per card | Each product card has exactly one button: Order / Buy / Get |
| Card → overlay | Clicking a card opens a full detail overlay, not a new page |
| Mobile-first | Designed for a phone. Desktop is a bonus. |
| No clutter | No long "About Us" walls of text. Trust is built by product photos + reviews. |
| Social proof close to products | Reviews appear right below products, not buried at the bottom |

**The page flow:**
```
Brand Header (compact — logo, tagline, social links)
    ↓
Products Grid (the main content — visible without scrolling on mobile)
    ↓
Social Proof / Reviews (brief, close to products)
    ↓
Footer (socials, copyright)

+ Product Detail Overlay (opens on card click, covers full screen)
+ Floating WhatsApp button (always visible)
```

---

## File Architecture

```
one-file.html
├── <head>        Google Fonts + viewport meta
├── <style>       ALL CSS — ordered by section (see below)
├── <body>        ALL HTML — ordered by section
└── <script>      ALL JS — grouped by feature at bottom
```

**Rule:** Never split into multiple files unless explicitly asked. One file = easy to share, deploy to GitHub Pages with one upload, no broken relative paths.

---

## CSS Section Order

```css
/* ── RESETS & ROOT ──────────────────────── */
/* ── BRAND HEADER ───────────────────────── */
/* ── PRODUCTS GRID ──────────────────────── */
/* ── PRODUCT CARD ───────────────────────── */
/* ── SOCIAL PROOF ───────────────────────── */
/* ── FOOTER ──────────────────────────────── */
/* ── FLOATING WA ─────────────────────────── */
/* ── PRODUCT DETAIL OVERLAY ──────────────── */
/* ── RESPONSIVE ──────────────────────────── */
```

If the client wants more sections (About, How It Works, etc.) add them between SOCIAL PROOF and FOOTER. Never add them before the products grid.

---

## :root Variables — Always Define These

Replace values with the brand's palette. Never hardcode colors inline.

```css
:root {
  /* Brand colors — fill in per project */
  --primary-900: ;
  --primary-800: ;
  --primary-700: ;
  --primary-400: ;
  --primary-100: ;
  --primary-50:  ;
  --accent:      ;
  --accent-light:;

  /* Neutral scale — reuse as-is */
  --white:     #FFFFFF;
  --off-white: #FAFAF8;
  --gray-50:   #F6F5F3;
  --gray-100:  #EBEBEA;
  --gray-400:  #9C9C9A;
  --gray-600:  #5C5C5A;
  --gray-900:  #1A1A18;

  /* WhatsApp — always these exact values */
  --wa:      #25D366;
  --wa-dark: #128C7E;

  /* Animation — never change */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* Border radius scale */
  --r-sm: 8px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px; --r-full: 9999px;

  /* Shadow scale */
  --sh-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --sh-md: 0 4px 16px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
  --sh-lg: 0 12px 40px rgba(0,0,0,.12), 0 4px 10px rgba(0,0,0,.06);
  --sh-xl: 0 24px 64px rgba(0,0,0,.14), 0 8px 20px rgba(0,0,0,.07);
}
```

---

## CSS Resets (always at top of `<style>`)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
```

---

## Section Patterns

### BRAND HEADER
Not a full-screen hero. Compact — takes up ~30vh max. Gets out of the way so products are seen immediately.

- Logo/brand image centered or left-aligned
- Short tagline (1 line)
- Social media icon row (links to real accounts)
- Optional: a trust badge row ("100% Natural · Handmade · Ships Fast")
- No nav links needed — the page is short enough to scroll

```css
.brand-header {
  padding: 40px 24px 32px;
  text-align: center; /* or left — depends on brand */
}
.brand-tagline {
  font-size: 15px; color: var(--gray-600);
  max-width: 380px; margin: 8px auto 0;
}
.header-socials {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; margin-top: 20px;
}
```

### PRODUCTS GRID
The main section. Should be the first thing visible on mobile.

```css
.products-section {
  padding: 0 20px 64px;
  max-width: 960px; margin: 0 auto;
}
.pgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

### PRODUCT CARD
Each card = one product. One image, one title, one short description (2 lines max), one button.

```css
.pcard {
  border-radius: var(--r-xl);
  overflow: hidden;
  box-shadow: var(--sh-md);
  cursor: pointer;
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
  background: var(--white);
}
@media (hover: hover) and (pointer: fine) {
  .pcard:hover { transform: translateY(-4px); box-shadow: var(--sh-lg); }
}
.pcard:active { transform: scale(0.98); }
.pcard-img { aspect-ratio: 4/3; object-fit: cover; width: 100%; }
.pcard-body { padding: 20px; }
.pcard-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; }
.pcard-desc { font-size: 13px; color: var(--gray-600); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.btn-wa-card {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; margin-top: 16px;
  background: var(--primary-800); color: #fff;
  font-size: 14px; font-weight: 700;
  padding: 14px; border-radius: var(--r-full);
  transition: transform 160ms var(--ease-out), background 160ms;
}
.btn-wa-card:active { transform: scale(0.97); }
```

- Scroll-reveal: IntersectionObserver → adds `.visible` class
- Stagger: `transition-delay: calc(var(--i) * 80ms)` with `--i` as inline style

### SOCIAL PROOF
Brief review strip directly below products. No full testimonial section needed.

Option A — Marquee (if 6+ reviews):
```css
.reviews-track { display: flex; gap: 16px; animation: marquee 30s linear infinite; }
.reviews-track:hover { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .reviews-track { animation: none; } }
```
Duplicate the list twice inside the track for seamless loop.

Option B — Static grid (if 3–5 reviews):
```css
.reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
```

### PRODUCT DETAIL OVERLAY
Full-screen overlay triggered by card click. Replaces navigating to a new page.

```css
.pd-overlay {
  position: fixed; inset: 0; z-index: 400;
  background: var(--white); overflow-y: auto;
  opacity: 0; visibility: hidden; transform: translateY(16px);
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out), visibility 0ms 300ms;
}
.pd-overlay.pd-open {
  opacity: 1; visibility: visible; transform: translateY(0);
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out), visibility 0ms;
}
.pd-body {
  display: grid; grid-template-columns: 1fr 1fr;
  max-width: 960px; margin: 0 auto;
  padding: 60px 40px 80px; gap: 64px;
}
.pd-img-wrap { position: sticky; top: 80px; border-radius: var(--r-xl); aspect-ratio: 1/1; overflow: hidden; }
```

- Back button at top: `← Back to Products`
- Overlay content: image, tag, name, volume, stars, description, key benefits, order button
- JS data: `const pdData = { 'Product Name': { tag, vol, img, desc, benefits: [], wa } }`
- Always: `document.body.style.overflow = 'hidden'` on open, restore on close
- Close on: back button click, Escape key

### FLOATING WHATSAPP BUTTON
Always visible. Links to business WhatsApp number.

```css
.float-wa {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  display: flex; align-items: center; gap: 10px;
  background: var(--wa); color: #fff;
  font-size: 14px; font-weight: 700;
  padding: 14px 22px; border-radius: var(--r-full);
  box-shadow: 0 4px 20px rgba(37,211,102,.35);
  transition: transform 160ms var(--ease-out), box-shadow 160ms;
}
.float-wa:active { transform: scale(0.97); }
```
- Hide when product detail overlay is open (JS: check `pd-open` class)

### FOOTER
Minimal. Brand mark + socials + copyright.

- Social icons: `<a href="REAL_URL" target="_blank" rel="noopener">`
- Icon hover per brand: `data-brand="instagram"`, `data-brand="tiktok"`, etc. → colored background
- No full nav links needed in footer (page is short)

---

## Mobile Responsiveness — Required Breakpoints

### 768px
```css
@media (max-width: 768px) {
  .brand-header { padding: 28px 20px 24px; }
  .pgrid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .pd-body { grid-template-columns: 1fr; gap: 28px; padding: 28px 20px 60px; }
  .pd-img-wrap { position: static; }
  .reviews-grid { grid-template-columns: 1fr 1fr; }
  .footer-bottom { flex-direction: column; text-align: center; gap: 6px; }
}
```

### 480px
```css
@media (max-width: 480px) {
  .pgrid { grid-template-columns: 1fr; }
  .pcard-img { aspect-ratio: 16/9; }
  .brand-header h1 { font-size: 26px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .float-wa span { display: none; } /* show icon only */
}
```

---

## JS Sections (at bottom of file, in this order)

```js
// 1. Product data object
const pdData = { 'Product Name': { tag, vol, img, desc, benefits: [], wa } };

// 2. Product card click → populate + open overlay
// 3. Overlay close (back button, Escape key)
// 4. Floating WA hide when overlay is open
// 5. Scroll-reveal cards (IntersectionObserver)
// 6. Review marquee pause on hover (if marquee option used)
```

No nav scroll tracking needed — there's no nav.

---

## Animation Rules (non-negotiable)

| Rule | Do | Don't |
|---|---|---|
| Entering elements | `ease-out`, fade + slight `translateY` | `ease-in`, `scale(0)` |
| Button press | `transform: scale(0.97)` on `:active` | No feedback at all |
| Card hover | `translateY(-4px)` + deeper shadow | Outline or border change |
| Only animate | `transform`, `opacity`, `filter` | `height`, `width`, `padding` |
| Hover on touch devices | Wrap in `@media (hover: hover) and (pointer: fine)` | Apply hover to all devices |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` | Skip this |
| Duration (UI) | 150–300ms | Over 400ms for micro-interactions |

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## What NOT to include by default

These are not Stan Store — don't add them unless the user explicitly asks:

- Full-screen hero with background image and gradient overlays
- "How It Works" step-by-step section
- Long "About Us" section
- Traditional nav bar with multiple links
- Blog or article section

If the user asks for a "full marketing site" instead of a storefront, then add these.

---

## Deployment (GitHub Pages)

1. Create repo on GitHub
2. Upload single HTML file + asset folders (`products/`, `assets/`)
3. Settings → Pages → Branch: `main`, Folder: `/(root)`
4. Live in ~60 seconds at `https://username.github.io/repo-name/filename.html`

To update: replace the file, commit — live within seconds.

---

## Common Mistakes to Avoid

- Don't `transition: all` — always specify the exact property
- Don't forget `-webkit-backdrop-filter` alongside `backdrop-filter` (Safari)
- Don't forget `type="button"` on `<button>` elements not inside a form
- Don't set CSS variables on parent elements when animating children (triggers full subtree recalc) — set `transform` directly
- Don't `display: none` for overlay close — use `opacity + visibility` trick (see overlay CSS above)
- Don't forget `document.body.style.overflow = 'hidden'` when overlay opens
- Don't add a full-screen hero just because the previous site had one — check the page type first
