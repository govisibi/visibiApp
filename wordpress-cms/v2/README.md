# VISIBI WordPress site

The code in this directory powers `https://govisibi.ai/`. It was first built as
the `/v2/` preview and was then promoted to the domain root. The live site still
uses the `v2_` WordPress table prefix. Requests to `/v2/` redirect to the root.

## What is managed in WordPress

- Pages and Insights articles: Pages and Posts in the WordPress admin.
- Menus: Appearance > Menus.
- Images, including the team portraits: Media Library and VISIBI Images.
- SEO titles and descriptions: Yoast SEO on each page or post.
- Enquiries: WordPress Enquiries; notifications use the configured SMTP account.
- Shared copy: VISIBI Copy.

The theme files under `wp-content/themes/visibi` control the layouts and browser
interactions. The custom MU plugins under `wp-content/mu-plugins` provide the
editor and shared site functions. Third-party plugins, WordPress core, database
content, credentials, and uploads are kept outside Git.

## Deployment

Railway builds [`../Dockerfile`](../Dockerfile), which copies this theme and its
MU plugins into the persistent WordPress volume. Runtime configuration, URL
redirects, and crawler rules are in [`deploy`](deploy). The `robots.txt` rule
currently disallows all crawlers, as requested. The site has a separate Railway
MySQL service; its data and uploads are not automatically synchronized to local
Docker.

The `_migration` directory contains migration and verification utilities. The
team-photo importer is idempotent and runs during container startup. The other
utilities are historical records or focused checks and are not served as pages.

For the existing local preview, [`local-compose.yaml`](local-compose.yaml) runs
Apache against the retained `visibi-cms_wp_data` volume and MariaDB network.
The preview lives at `http://localhost:8082/v2/`; the domain-root path redirects
there. This local install uses the separate `visibi_v2` database. The obsolete
local root database and site files have been backed up and removed.

Before changing the live database or persistent volume, take a backup. Keep
credentials in the project-specific private configuration directory, never Git.
