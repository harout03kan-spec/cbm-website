# Canada BTC Miners — website

Bilingual (EN/FR) React + Vite marketing & storefront for **Canada BTC Miners**
(canadabtcminers.ca). The React app is the customer-facing UI; **Ecwid /
Lightspeed eCom (public store id `99673270`)** handles the real cart, checkout,
Moneris payment, taxes, shipping, order emails and abandoned-cart recovery via a
public JS-API handoff. No backend, no server secrets in this repo.

| | |
|---|---|
| **Repository** | `harout03kan-spec/cbm-website` |
| **Netlify project** | `rad-kitten-18acc7` |
| **Production domain** | `canadabtcminers.ca` (+ `www`) |
| **Ecwid store id** | `99673270` (public — safe in the bundle) |
| **Node** | 20 LTS (Vite 7 requires Node ≥ 20.19 / 22.12) |

## Stack

React 19 · Vite 7 · TypeScript · Tailwind CSS 3 · react-router-dom 7 (`useRoutes`
+ lazy) · i18next (EN/FR) · framer-motion · Ecwid storefront JS API. Product data
is a **static catalog** (`src/data/catalog.ts`); the shop UI is React, checkout is
Ecwid. `xlsx` is used only by the internal CRM.

## Commands

```bash
npm ci             # clean install (uses package-lock.json)
npm run dev        # local dev server (http://localhost:3000)
npm run type-check # tsc --noEmit
npm run build      # production build -> ./out
npm run preview    # serve the built ./out locally
npm run lint       # eslint (see "Known lint state" below)
```

## Build & deploy (Netlify)

- **Build command:** `npm run build`
- **Publish directory:** `out`  ← note: this project's Vite `build.outDir` is
  `out`, **not** the Vite default `dist`. `netlify.toml` pins this.
- **SPA fallback:** `public/_redirects` (`/* /index.html 200`) and `netlify.toml`
  — required so deep links like `/shop`, `/about`, `/fr/shop`, `/product?id=…`
  resolve on a direct hit / refresh.
- Preferred production flow: **GitHub → Netlify**, production branch `main`.
  Netlify deploys the exact pushed commit. Confirm the site is not paused / not
  over an account build limit.

### Routes

Public: `/`, `/shop`, `/bulk-deals`, `/product?id=<id>`, `/hosting`, `/services`,
`/about`, `/contact`, and the French mirror under `/fr/*`.
Non-indexed / app routes (blocked in `robots.txt`): `/crm` (internal, passcode),
`/cart`, `/checkout`, `/order-success` (legacy React pages — see below).

The internal Ecwid test routes `/store-test` and `/store-test-cart` were **removed
from production**. Both now **301-redirect to `/shop`** (Netlify edge redirect in
`netlify.toml` / `public/_redirects`, plus an in-app `<Navigate>` for client-side
navigation) so old preview links / bookmarks never 404. The shared Ecwid theme
they used (`src/pages/store-test-cart/ecwid-theme.css`) is **kept** — the real cart
drawer imports it.

The primary cart/checkout is the **Ecwid drawer** (navbar cart button →
`openCart`). `/cart`, `/checkout`, `/order-success` are **legacy** React pages
kept in place; they use a separate local cart and are not linked from the nav.

## Environment variables (public only)

All are optional and PUBLIC (see `.env.example` — never put secrets here):

- `VITE_RECAPTCHA_SITE_KEY` — public reCAPTCHA v3 site key (newsletter capture).
- `VITE_CRM_PASSCODE_HASH` — client-side gate for `/crm`. **Not real security**
  (the CRM ships in the public bundle); defaults to a weak `"123"`. Set a strong
  value or host the CRM separately before launch.

**No Moneris credentials and no Ecwid private/REST token belong in this repo or
its env.** Payment/orders/taxes/shipping are configured in the Ecwid dashboard.

## Netlify Forms (important portability warning)

The contact form and the discount signup use **Netlify Forms**. Netlify detects
them from hidden `<form name="contact">` / `<form name="discount-signup">` in
`index.html`; the React pages POST the same field names. **Moving only the `out/`
folder to ordinary cPanel / SiteGround / another static host will silently break
these forms** unless the developer installs a replacement form backend. The SPA
redirect (`_redirects` / `netlify.toml`) is also Netlify-specific and would need
an equivalent rewrite on another host.

## Ecwid dashboard checklist (not code — do in the Ecwid admin)

- Allowed storefront domains include `canadabtcminers.ca` and the Netlify URL.
- Guest checkout on; Canadian taxes (GST/QST/HST by province) configured.
- **Shipping & Pickup** zones cover Canada (all provinces incl. Quebec); add the
  **United States** zone + a shipping method if US orders are wanted. Remove any
  unwanted flat-rate methods.
- Order-confirmation, shipment and tracking emails enabled + branded; store
  notification recipient set. Privacy/cookie consent + abandoned-cart recovery.
- **Create the 33 supplier miners** (see below) as real Ecwid products if they
  should be directly purchasable; otherwise they stay as Contact/inquiry items.

## Moneris checklist (not code — via Ecwid / Moneris)

- Test vs production credentials; supported card types; confirm **debit** is
  actually enabled in the online flow (the storefront copy says "credit and debit
  card"). Run a test sale, a declined-card test, and a refund test before going
  live. Credentials live in Ecwid/Moneris, never in this repo.

## DNS (do not change without authorization)

Point `canadabtcminers.ca` and `www` at the Netlify project `rad-kitten-18acc7`
(Netlify → Domain management shows the exact target). Typical:
`www` → CNAME to the Netlify site; apex → Netlify DNS or an `ALIAS/ANAME` (or the
A record Netlify provides). Verify HTTPS/SSL (Let's Encrypt) after propagation.

## Rollback

Netlify keeps every deploy: **Deploys → select a previous successful deploy →
Publish deploy**. In git: `git revert <commit>` (or reset `main` to a known-good
commit) and push; Netlify redeploys.

## Known lint state

`npm run lint` currently reports errors, ~90% of them inside the internal CRM
(`src/pages/crm/*`, unused vars / empty blocks). Lint is **not** part of the build
(`npm run build` / `type-check` pass cleanly). Clean up incrementally if desired.
