# VISIBI WordPress migration package

This folder contains a WordPress theme, 174 page and article exports, and a repeatable importer. The original `.dc.html` files remain untouched in the parent folder. The local preview is installed at `http://localhost:8082/v2/` in the `visibi-cms-wordpress-1` Docker container, with its own `visibi_v2` MariaDB database. It uses the existing local WordPress administrator login.

## Installation target

Use a **separate WordPress database** and set the WordPress home/site URL to `https://govisibi.ai/v2` for preview. Do not point this install at the current application database. The importer only changes the new WordPress database: it creates or updates pages/posts/menus, sets the front page and permalink structure, and stores SEO metadata. Rollback is to remove the preview install and its dedicated database. It does not access Production in this package.

For a later server install, use a current supported WordPress release in `/v2/` while retaining this folder's `wp-content`, `.htaccess`, `content.json`, and `_migration`. Configure `wp-config.php` outside source control with preview database credentials. Activate the **VISIBI** theme. Then run `php _migration/import.php` in `/v2/` and check the summary is 84 pages, 90 posts, 0 failures. The importer is idempotent by slug and can be rerun after regenerating content. Article categories, titles and publication dates come from `articles-data.js`. Run `node _migration/prepare-package.js` before upload to copy local media into the theme and create the redirect map. The `_migration` directory is denied to web requests.

## Editing

- Pages and articles: **VISIBI Copy** in WordPress admin edits text without touching layout. The normal **Pages** and **Posts** editors contain separate Custom HTML blocks for each imported layout section. Structural design edits still need HTML familiarity.
- Images: **VISIBI Copy → VISIBI Images** chooses assets from the Media Library for the 122 image positions found in the prototype. Set useful alt text in the Media Library. Unfilled positions visibly say what is missing.
- Navigation: **Appearance → Menus**.
- Site logo and favicon: Appearance > Customize > Site Identity. The 512 px VISIBI Site Icon is seeded on first import and is editable there.
- Enquiries: The real form stores private entries in WordPress Enquiries and emails the WordPress admin. Local authenticated SMTP and a full form submission were verified; the latest notification status is Sent. Configure staging SMTP using a private, untracked file.
- SEO titles and descriptions: **Yoast SEO** is active on the local preview. The importer seeds both Yoast and Rank Math fields from `seo-data.js`; theme fallback metadata is used until an SEO plugin is active.
- URLs: pages use short root slugs such as `/geo/` and `/ecommerce-development/`; guides use `/insights/{slug}/`. Review `redirects.csv` against existing live URLs before launch.

## Recommended plugins

Install only these after checking your hosting and WordPress version:

1. [Yoast SEO](https://wordpress.org/plugins/wordpress-seo/) for editor-managed metadata, schema and XML sitemaps. It is already active locally; use only one SEO plugin.
2. [Fluent Forms](https://wordpress.org/plugins/fluentform/) if the team wants a visual form builder, anti-spam settings and form workflows. Create a form with Name, Email, Phone, Website, Need and Message fields, then enter its ID under **Settings → General → VISIBI Fluent Form ID**. Until then, the theme's fallback form handles submissions.
3. [Redirection](https://wordpress.org/plugins/redirection/) for managing launch redirects and 404s. Import and review `redirects.csv` at launch. Check old live URLs against analytics/Search Console before applying redirects; the map currently covers prototype `.dc.html` paths and legacy article slugs.

Configure staging mail with the secret-free MU plugin and a private .visibi-smtp.php beside wp-config.php. Set the staging WordPress admin email to info@govisibi.ai. Choose one caching solution based on the host.

## Preview indexing

The `/v2/` theme and MU plugin emit `noindex, nofollow, noarchive` for the preview. `.htaccess` also sends an `X-Robots-Tag` header on Apache for `/v2/` requests. The local domain-root `/robots.txt` contains `Disallow: /v2/`. **Search engines read `https://govisibi.ai/robots.txt`, not `/v2/robots.txt`.** Merge `root-robots-addition.txt` into the future domain-root robots file for an online preview. Keep existing root rules intact.

Before the approved root launch, remove the root `/v2/` disallow entry and replace preview `.htaccess` with the production rewrite file. The theme/MU-plugin noindex checks turn off when the WordPress home URL no longer ends in `/v2/`. Verify response headers and meta tags on several root pages before allowing indexing.

## SEO and content review before launch

- Confirm each imported page has one meaningful H1, a unique title/description, correct internal links, and no unresolved `.dc.html` links.
- The user approved the existing testimonials, badges, prices and case-study copy. Keep those sections; add their final photos, logos, certificates and screenshots through **VISIBI Images**. The source contains image placeholders rather than those final files.
- Review legal Terms/Privacy, invoice/payment destination and form consent. **Careers and Pay Invoice are imported as drafts** because their application/payment flows are not connected. No payment or CV upload should be presented as working until integrated and tested.
- Review desktop and mobile pages against the source screenshots. Logo motion, announcement rotation, scroller, services menu, homepage tabs, FAQ and game were restored and browser-tested. Other prototype controls may need separate implementations before root launch.
- Test a real enquiry, notification email, spam protection, keyboard navigation, internal links, XML sitemap, redirects and a complete launch crawl.

This package is installed in local Docker for the dedicated `/v2/` preview. It has not been deployed online or promoted to Production.

Run `_migration/verify-preview.ps1`, `check-live.js`, `audit-live-parity.js` and `check-interactions.js` against the local preview for route, SEO, link and interaction checks.
