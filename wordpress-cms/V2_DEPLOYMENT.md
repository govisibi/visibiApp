# Govisibi /v2 WordPress preview

This source adds an isolated WordPress install under `https://govisibi.ai/v2/` to the existing Apache service. It does not replace the root site. The WordPress core and approved migration package are copied into the persistent volume at container startup. The root WordPress install receives one MU plugin that adds `Disallow: /v2/` to its generated `robots.txt`; the preview also emits noindex headers and metadata.

## Runtime variables

Provision a **dedicated MySQL service** in the Govisibi `visibi-wordpress` Railway project. Add these variables to the existing WordPress service, using Railway references to the new database for the first four:

- `VISIBI_V2_DB_HOST`
- `VISIBI_V2_DB_NAME`
- `VISIBI_V2_DB_USER`
- `VISIBI_V2_DB_PASSWORD`
- `VISIBI_V2_AUTH_SECRET` (independent random value; keep it stable)
- `VISIBI_V2_ADMIN_PASSWORD` (independent initial administrator password)
- `VISIBI_SMTP_PASSWORD` (the approved `info@govisibi.ai` SMTP password)
- `VISIBI_SMTP_USERNAME=info@govisibi.ai`
- `VISIBI_SMTP_HOST=reymail.ukdns.biz`
- `VISIBI_SMTP_PORT=465`

No credentials are stored in Git. The entrypoint seeds a fresh database once, importing 84 pages and 90 posts, setting the Visibi theme and activating Yoast SEO if the root volume already has a copy. Imported content is idempotent by slug. The initial preview admin is `govisibi_v2_admin` with the password from `VISIBI_V2_ADMIN_PASSWORD`.

## Verification

Check `/v2/`, `/v2/contact/`, `/v2/insights/`, `/v2/wp-admin/` and representative service pages. Check that `https://govisibi.ai/robots.txt` includes `Disallow: /v2/` and preview responses include `X-Robots-Tag: noindex, nofollow, noarchive`. Verify navigation, footer, JS interactions, contact submission, WordPress Enquiries, SMTP delivery, favicon, SEO metadata, and the 172 public routes. Confirm root URLs still render normally.

## Rollback

Redeploy the previous `visibi-wordpress` image or revert this source commit. The dedicated preview database and persistent `/v2` files can be retained for investigation, then removed after backup. No existing root WordPress tables are migrated or deleted.
