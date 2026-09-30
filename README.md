# Govisibi WordPress

This repository deploys the VISIBI WordPress site at `https://govisibi.ai/`.
WordPress runs at the domain root in production and at `http://localhost:8082/`
locally. Old `/v2/` URLs redirect to their root equivalents. The `v2_` database
table prefix is retained internally to preserve the approved content.

The application source is in [`src`](src). The root
[`Dockerfile`](Dockerfile) builds the Railway service. Runtime configuration,
redirects, and `robots.txt` are in [`src/deploy`](src/deploy). WordPress core,
plugins installed from WordPress.org, uploads, and the database are runtime data;
they are not committed here.

Railway and local Docker use separate databases and file volumes. The local
site uses the same Dockerfile and tracked theme, plugins, redirects, and robots
rules. Start it with `docker compose --env-file PATH_TO_PRIVATE_ENV --project-name
visibi-cms --file src/local-compose.yaml up -d --build`. The local database is
`visibi_v2` with the `v2_` table prefix. Content and uploads were copied from
production on 30 September 2026; later WordPress edits do not synchronize
automatically. Back up the local database and uploads before refreshing them.

Both sites allow all crawlers in `robots.txt`; the tracked file lists the live
Yoast XML sitemap. WordPress and Yoast provide page-level indexing directives.
