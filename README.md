# MokaTroy TFT Site v2

Clean static TFT Set 18 site for Cloudflare Pages / Workers.

## Structure
- `index.html` + page HTML (AR / EN / JA)
- `css/` styles
- `js/` vanilla modules
- `data/` JSON (comps, champions, patches, items, traits, augments)

## Language
- Default: Arabic (RTL)
- Switch via `?lang=en` / `?lang=ja` (stored in localStorage)
- Do **not** use `/en/` or `/ja/` path prefixes on Workers (they 404)

## Mobile
- Hamburger menu under 720px width (`.nav-toggle` + `.nav-open`)

## Deploy
Connect this repo to **Cloudflare Pages** with:
- Framework preset: **None** (static)
- Build command: *(empty)*
- Output directory: `/` (repo root)
- Production branch: `main`

After connecting, every push to `main` should auto-deploy to your `*.workers.dev` / custom domain.

If the live site is stale: Cloudflare Dashboard → Pages → your project → **Retry deployment** (or push any commit to `main`).
