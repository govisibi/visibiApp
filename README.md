# Govisibi WordPress

This repository deploys the approved VISIBI WordPress site at `https://govisibi.ai/`.
The site originated in the `v2` migration and still uses the `v2_` database table
prefix. The old root WordPress installation and its `wp_` tables have been removed.
`/v2/` URLs redirect to their equivalent root URLs.

The application source is in [`src`](src). The root
[`Dockerfile`](Dockerfile) builds the Railway service. Runtime configuration,
redirects, and `robots.txt` are in [`src/deploy`](src/deploy). WordPress core,
plugins installed from WordPress.org, uploads, and the database are runtime data;
they are not committed here.

Railway and local Docker use separate databases and file volumes. The local
`localhost:8082/v2/` preview can be refreshed from production, after backing
up its own database and uploads. Never sync local changes into production by
accident.

The live site allows all crawlers in `robots.txt` and lists the Yoast XML
sitemap. WordPress and Yoast provide page-level indexing directives.
