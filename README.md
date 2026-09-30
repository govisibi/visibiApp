# Govisibi WordPress

This repository deploys the approved VISIBI WordPress site at `https://govisibi.ai/`.
The site originated in the `v2` migration and still uses the `v2_` database table
prefix. The old root WordPress installation and its `wp_` tables have been removed.
`/v2/` URLs redirect to their equivalent root URLs.

The only application source is in [`wordpress-cms/v2`](wordpress-cms/v2).
[`wordpress-cms/Dockerfile`](wordpress-cms/Dockerfile) stays at its existing path
for the Railway build setting. Runtime configuration, redirects, and `robots.txt`
are in [`wordpress-cms/v2/deploy`](wordpress-cms/v2/deploy). WordPress core,
plugins installed from WordPress.org, uploads, and the database are runtime data;
they are not committed here.

Railway and local Docker use separate databases and file volumes. The local
`localhost:8082/v2/` preview is not a synchronized copy of production. Do not
overwrite either database with the other without a reviewed migration and backup.

The site currently tells all crawlers to stay out via `Disallow: /` in
`robots.txt`. Change that only on explicit request.
