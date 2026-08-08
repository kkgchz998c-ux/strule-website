# Deploy the Strule website — go-live checklist

Complete, deploy-ready site root. What's in here:
- Root pages: index, services, sectors, blog, **resources** (the library gate), **privacy**
- `sectors/` — 12 sector pages
- `blog/` — 13 posts (incl. 3 new cornerstone field guides)
- `tools/` — 3 interactive calculators
- `downloads/` — 24 gated PDF resources
- `functions/subscribe.js` — Cloudflare function that captures signups into Brevo and emails the library link
- `sitemap.xml`

Note: `og-cover.png`, `icons/`, and `site.webmanifest` are already live in the repo. They are not in this package, and GitHub "Upload files" never deletes existing files, so they stay put — no action needed.

## STEP 1 — Set the Brevo API key in Cloudflare (do this once)
Without it, the resources signup form returns "not configured."
1. Cloudflare dashboard → **Pages** → your project → **Settings → Environment variables** (Production).
2. **Add variable:** name `BREVO_API_KEY`, value = your Brevo API key. Click **Encrypt** so it's a secret.
3. Save.

## STEP 2 — Upload to GitHub (auto-deploys to Cloudflare)
1. Open the `strule-website` repo → **Add file → Upload files**.
2. Drag in the **contents of this folder** (not the folder itself). GitHub keeps the `sectors/`, `blog/`, `tools/`, `downloads/`, and `functions/` subfolders. Let it overwrite existing files.
3. **Commit to `main`.** Cloudflare Pages auto-deploys in ~1 minute.

## STEP 3 — Verify
- `struleautomation.com` loads and the nav shows **Resources**.
- `/resources.html`: enter a test email → "check your email" confirmation → the library-link email arrives from jgilmour@struleautomation.com → clicking it opens the unlocked library (green banner, all downloads live).
- `/blog/crushing-screening-controls-guide.html` and `/privacy.html` load.
- `/tools/oee-downtime-cost-estimator.html` calculates.

## Notes
- Phone **(707) 690-7054** is in the contact section and the resources hub.
- Mailing address **11 Iwanuma Dr, Napa, CA** is in the resources footer and privacy page — swap it for a P.O. box later in `resources.html` and `privacy.html` when you have one.
- Booking CTAs are phone-only; a Calendly link can be added later.
- CAN bus is now surfaced on the home page, services page, and every sector page.
