# Deploy the Strule website — go-live checklist

This `website/` folder is a **complete, deploy-ready site root**: index.html, services.html,
sectors.html, sectors/ (12 pages), icons/, og-cover.png, site.webmanifest.
Deploy = push these files to the Cloudflare-connected GitHub repo → Cloudflare auto-deploys.
(Note: index.html here supersedes the old single-page Strule_Website.html.)

## Route A — the repo + Cloudflare Pages already exist (site already live)
1. Open the `strule-website` repo on GitHub → **Add file → Upload files**.
2. Drag in the **contents of this website/ folder** (not the folder itself) — GitHub keeps the
   sectors/ and icons/ subfolders. Let it overwrite the old index.html.
3. Commit to `main`. Cloudflare Pages auto-deploys in ~1 minute.
4. Verify: struleautomation.com, /services.html, /sectors.html, /sectors/mining.html all load.

## Route B — first-time setup (not live yet)
1. **GitHub:** create a repo named `strule-website`, then upload the contents of this folder to the root.
2. **Cloudflare → Pages → Create → Connect to Git →** pick `strule-website`.
   - Framework preset: **None**. Build command: **(blank)**. Output directory: **/** (root).
   - Deploy.
3. **Custom domain:** Pages project → Custom domains → add `struleautomation.com` and `www`.
   (Domain DNS is already on Cloudflare, so it wires up automatically.)
4. Verify the URLs above.

## After it's live
- Replace the phone-number placeholder ("Add your business number") in index.html once you have the line.
- Re-check the og-cover link preview by pasting the URL into iMessage/LinkedIn.
