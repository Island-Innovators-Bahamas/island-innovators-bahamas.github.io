# Island Innovators Bahamas — Official Website

Live site: https://islandinnovatorsbahamas.com

Island Innovators Bahamas is a youth initiative facilitating STEAM programs, workshops, and community events in Nassau, Bahamas.

This repository contains the source code for the initiative's official website.

## How it is hosted

Static HTML served by GitHub Pages from the `main` branch, with the custom domain set in `CNAME` and DNS handled by Cloudflare. Pushing to `main` deploys the site. There is no build step on the server.

## Pages

| File | URL | Notes |
| --- | --- | --- |
| `index.html` | `/` | Homepage |
| `2026.html` | `/2026.html` | 2026 Music Performance & Production Intensive |
| `2025.html` | `/2025.html` | 2025 STEAM pilot results |
| `interest.html` | `/interest.html` | Future-programs interest form (Formspree) |
| `join/index.html` | `/join/` | Student interest roster, links to the Google Form |
| `thank-you.html` | `/thank-you.html` | Form confirmation page |
| `apply.html` | `/apply.html` | Application skeleton for a future cohort. `noindex`, not linked from anywhere. |
| `404.html` | any missing URL | Branded not-found page |

## Styling

Tailwind is **compiled**, not loaded from the CDN. `assets/css/tailwind.css` is a committed, minified build.

If you add or change a Tailwind class in any HTML file, rebuild it:

```bash
npm install
npm run build:css
```

Then commit the updated `assets/css/tailwind.css` together with your HTML change. Use `npm run watch:css` while editing.

Classes that only ever get added by JavaScript are listed in `safelist` in `tailwind.config.js`, so Tailwind does not strip them.

Everything outside Tailwind (the brand lockups, galleries, accordions, lightbox) lives in the `<style>` block of each page.

## Images

Photos live in `assets/images/photos/` and are resized to a 2000px long edge before being committed. Full-resolution camera files are far too large for a web page on Bahamian mobile data. Keep new photos under roughly 500 KB each.

Galleries use a CSS grid. A small script at the bottom of each gallery page stretches the last tile of any short row so rows stay flush, which means you can add or remove photos without the layout going ragged.

## Forms and tracking

- Interest form posts to Formspree (`mdaplvkw`), with a `form_type` hidden field identifying which form it came from.
- The student roster is a Google Form; responses stay in Google.
- Google Analytics 4 (`G-3D6CR9MP2K`) is on every page. Custom events: `interest_click`, `roster_click`.

## Things to keep current

- The first-round date on `/join/` (currently Friday, October 16, 2026).
- `sitemap.xml` `lastmod` dates when pages change meaningfully.
- The 2026 page is a completed-program record. New cohorts get their own page rather than edits to this one.
