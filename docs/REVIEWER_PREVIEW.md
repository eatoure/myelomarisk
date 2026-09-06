# Reviewer Preview

Calculators that are built but not yet cleared for publication live behind a
password gate so clinicians can test them before go-live.

## What reviewers see

- **`/#/preview`** — a list of every calculator awaiting review, with a short
  note on what is still outstanding for each one.
- Each in-testing calculator's own route is gated as well, so a shared deep
  link still asks for the password.
- Gated calculators do **not** appear on the public home page grid.

The unlock lasts for the browser session (`sessionStorage`), so reviewers
enter the password once per visit.

## Security — read this before relying on it

**This is not a security control.** MyelomaRisk is a static site served from
GitHub Pages, so there is no server to check a password. The expected value is
compiled into the JavaScript bundle and can be read by anyone who opens
developer tools on a preview build.

The gate exists to keep unreviewed calculators from being stumbled upon by
patients or clinicians browsing the site. Do not put anything genuinely
confidential behind it, and do not treat "it is password protected" as a
clinical safeguard.

If real access control is needed, host the preview somewhere with server-side
auth — Netlify or Cloudflare Pages password protection, or a private repo's
Pages site restricted to organisation members.

## Configuring the password

The password lives in `.env.preview.local`, which is gitignored:

```sh
cp .env.preview.local.example .env.preview.local
# then set VITE_PREVIEW_PASSWORD=...
```

It is injected only in two situations:

| Command | Mode | Password included? |
|---|---|---|
| `npm run dev` | development | yes |
| `npm run build:preview` | preview | yes |
| `npm run build` | production | **no** |
| `npm run build:site` | production | **no** |

This split matters because `site/` is tracked in git. A normal production
build never contains the password, so syncing to `site/` cannot commit it.
`scripts/sync-site.mjs` additionally scans the build and refuses to sync if the
password is found, as a backstop.

When no password is configured, the preview routes stay closed and show an
explanatory message — it fails closed, not open.

## Deploying a preview for reviewers

**myelomarisk.com is hosted on Netlify**, not GitHub Pages. The repo also
contains `.github/workflows/deploy-pages.yml`, which publishes to GitHub Pages
— that is not the live site. Its output and the tracked `site/` folder are
both leftovers from an earlier hosting setup.

The domain's DNS is managed by Netlify (NS1 nameservers), so a
`deploy.myelomarisk.com` subdomain can be pointed at a preview site from the
Netlify dashboard without touching an external registrar.

Suggested setup:

1. Create a `preview` branch from `main`.
2. In Netlify, enable branch deploys for `preview` (or create a second site
   from the same repo tracking that branch).
3. Assign the custom domain `deploy.myelomarisk.com` to that deploy.
4. `netlify.toml` already builds non-production contexts with
   `npm run build:preview`, so the reviewer password is compiled in there and
   only there, and sets `X-Robots-Tag: noindex` so the preview stays out of
   search results.

### About the password prompt

Netlify's built-in, server-side **password protection is a paid feature**
(Pro plan). With it, `deploy.myelomarisk.com` prompts for a password before
serving anything — real access control, and the behaviour you probably want.

On the free tier there is no server-side prompt. The in-app gate still works,
but as described above it is obfuscation only. If real access control is
needed without a Netlify paid plan, put the preview behind Cloudflare Access,
which can restrict by email address for free.

## Promoting a calculator to live

1. Remove its entry from `previewCalculators` in `src/lib/preview.ts`.
2. Unwrap its `<Route>` from `<PreviewGate>` in `src/App.tsx`.
3. Add its card to the `calculators` array in `src/pages/Index.tsx`.
