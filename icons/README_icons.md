# Strule icons — what they are and where they go

Generated from the Strule signal mark. The website's `<head>` already references these; they only work if the files sit at the **site root** in the right place.

## When you host the site, upload so the live layout is:

```
/                      ← site root (where index.html lives)
├── index.html
├── og-cover.png            ← the social share card (from 06 Brand & Marketing)
├── site.webmanifest        ← from this folder
└── icons/
    ├── favicon-16.png
    ├── favicon-32.png
    ├── favicon-48.png
    ├── apple-touch-icon.png     (180×180 — iOS home screen / bookmarks)
    ├── icon-192.png            (Android / PWA)
    ├── icon-512.png            (Android / PWA, install splash)
    └── maskable-512.png        (Android adaptive/maskable icon)
```

Note: `site.webmanifest` goes at the **root**, not inside `/icons/`. Everything else stays in `/icons/`.

## What each file is for
- **favicon-16/32/48** — browser tab icon (PNG fallback; the site also has a sharper inline SVG favicon, so modern browsers use that).
- **apple-touch-icon** — the icon iOS uses if someone adds the site to their home screen. Full-bleed navy; iOS rounds the corners itself.
- **icon-192 / icon-512** — Android / installable-web-app icons.
- **maskable-512** — extra padding so Android's adaptive-icon shapes don't crop the mark.

## Checking it worked (after launch)
- Browser tab should show the navy "S" mark.
- iPhone: Safari → Share → Add to Home Screen → the icon should be the navy square, no white border.
- Deep check: Chrome DevTools → Application → Manifest (lists icons + flags maskable issues).

## Design source
Rendered from `icon_round.html` / `icon_flat.html` / `icon_maskable.html`. To regenerate at different sizes, re-run those through headless Chrome `--screenshot` at the target `--window-size`.
