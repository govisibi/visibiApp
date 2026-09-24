# Visibi React inside WordPress

WordPress serves the React site at http://localhost:8082/. React keeps the existing design and routes. WordPress provides the admin, pages, posts, menus, media, Yoast SEO output, and Contact Form 7.

## Local WSL setup

From the WSL copy of this repository:

1. Run `cd ~/visibiApp/wordpress-cms && docker compose up -d`.
2. Open `http://localhost:8082/wp-admin/`. Sign in with `admin@visibi.local` (username `visibiadmin`); the local password is `WP_ADMIN_PASSWORD` in the ignored `wordpress-cms/.env` file.
3. If setting up a fresh WordPress volume, install and activate `wordpress-seo` and `contact-form-7`, activate the `visibi-react` theme, then run the three `seed-*.sh` scripts through the CLI service. This workspace has already completed those steps.
4. Run `cd ~/visibiApp/frontend && npm run build:wordpress`. Open `http://localhost:8082/`.

The WordPress theme runs `wp_head()`, `wp_body_open()`, and `wp_footer()`, so supported WordPress plugins can add their normal front-end assets and metadata. The React theme build disables React Helmet; Yoast supplies the served page's SEO tags. The generated React bundle is ignored by Git and must be rebuilt after React source changes. WordPress content edits appear after a browser refresh without rebuilding.

## Editing the site

- **Visibi Content** edits copy, links, and image URLs in the existing bespoke React layouts. Its **Preview React site** button opens the actual WordPress-hosted page.
- **Pages → Add New** creates a new page. Publish it, then use its slug as the URL. New pages use the shared React page layout and display WordPress editor content.
- **Visibi Content → Edit primary navigation** opens the WordPress menu editor. Add the new Page to **Visibi Primary** and save the menu.
- **Posts → Add New** creates a new Insights article at `/insights/<slug>/`. The three original longform article bodies remain in their existing React layouts and are editable through **Visibi Content**; their WordPress post records provide Yoast settings and listing metadata.
- **Yoast SEO** on a Page or Post manages the title, description, canonical URL, social preview, and schema for the WordPress-served URL. Existing React routes have matching WordPress Page or Post records.
- **Contact → Contact Forms** edits the form shown on the React Contact page. Its fields and message are submitted to Contact Form 7's WordPress REST endpoint. Configure WordPress mail delivery or SMTP before relying on real email delivery.
- **Media → Library** stores images; use their URLs in Visibi Content fields or WordPress page/post content.

New WordPress Pages and Posts render through WordPress. An unrelated plugin may still need specific React integration if it expects to replace PHP template markup or interact with React-owned elements.

## Development and source control

Run `npm run cms:extract` in `frontend` after changing existing React page source, then `npm run build:wordpress`. The content manifest is tracked at `wordpress-cms/visibi-content/content-manifest.json`. The Docker database, uploads, installed third-party plugin files, and `wordpress-cms/.env` are local and untracked. No production deployment or DNS change is included.
