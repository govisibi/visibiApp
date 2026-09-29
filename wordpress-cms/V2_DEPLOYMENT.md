# Govisibi /v2 WordPress preview

This source adds a second WordPress install under `https://govisibi.ai/v2/` to the existing Apache service. It uses the **same MySQL database** as the root WordPress site, with the separate `v2_` table prefix. It does not replace the root site. The WordPress core and approved migration package are copied into the persistent volume at container startup. The root WordPress install receives one MU plugin that adds `Disallow: /v2/` to its generated `robots.txt`; the preview also emits noindex headers and metadata.

## Runtime variables

The preview reuses the existing `WORDPRESS_DB_*` runtime variables (including supported `_FILE` variants). Its cookie keys are derived separately from the existing database password; `VISIBI_V2_AUTH_SECRET` can override that derivation if desired. The root table prefix must differ from `v2_`. To enable authenticated notification email, add:

- `VISIBI_SMTP_PASSWORD` (the approved `info@govisibi.ai` SMTP password)
- `VISIBI_SMTP_USERNAME=info@govisibi.ai`
- `VISIBI_SMTP_HOST=reymail.ukdns.biz`
- `VISIBI_SMTP_PORT=465`

No credentials are stored in Git. The entrypoint creates only `v2_` WordPress tables and seeds them once, importing 84 pages and 90 posts, setting the Visibi theme and activating Yoast SEO if the root volume already has a copy. Imported content is idempotent by slug. The initial preview administrator uses the existing root WordPress administrator login and password hash; later password changes are independent.

## Verification

Check `/v2/`, `/v2/contact/`, `/v2/insights/`, `/v2/wp-admin/` and representative service pages. Check that `https://govisibi.ai/robots.txt` includes `Disallow: /v2/` and preview responses include `X-Robots-Tag: noindex, nofollow, noarchive`. Verify navigation, footer, JS interactions, contact submission, WordPress Enquiries, SMTP delivery, favicon, SEO metadata, and the 172 public routes. Confirm root URLs still render normally.

## Rollback

Redeploy the previous `visibi-wordpress` image or revert this source commit. The new `v2_` tables and persistent `/v2` files can be retained for investigation, then removed after backup. No existing root WordPress tables are migrated or deleted.
