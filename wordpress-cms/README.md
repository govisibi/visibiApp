# Visibi React inside WordPress

WordPress serves the React site at http://localhost:8082/. React keeps the existing design and routes. WordPress provides the admin, pages, posts, menus, media, Yoast SEO output, and Contact Form 7.

## Production architecture

`govisibi.ai` is served directly from the dedicated Railway `visibi-wordpress` project. Cloudflare manages DNS. `www.govisibi.ai` redirects to the apex, and the WordPress admin is at `https://govisibi.ai/wp-admin/`. The Vercel `visibi-app` project still exists but is not in the public site's request path.

```text
Browser -> Cloudflare DNS -> Railway visibi-wordpress (WordPress + Apache)
                              |-- visibi-react theme: React bundle and page shell
                              |-- visibi-content plugin: editable copy, menu and REST API
                              |-- Yoast SEO and Contact Form 7
                              |-- persistent WordPress files volume
                              +-> Railway MySQL service -> persistent database volume
```

The Railway Dockerfile builds `frontend` with `npm run build:wordpress` and copies the bundle into the `visibi-react` WordPress theme. WordPress renders the HTML shell and calls `wp_head()`/`wp_footer()` so plugins can add SEO tags and assets. React mounts in `#root`, keeps the existing layouts and routes, and fetches copy/menu/form data from `/wp-json/visibi/v1/site` plus pages and posts from the WordPress REST API. Content changes can appear after refresh; changing the React layout or bundle requires a code deploy.

Production uses a Railway MySQL service; local Docker Compose uses MariaDB. The two environments have separate databases and file volumes. The main `govisi` platform in Railway's `charismatic-renewal` project is separate from this website. Its former WordPress and MySQL services were removed; their detached volumes are marked for deletion. The site also contains brand-analysis and other actions that call a separate API URL from React code (the homepage defaults to `https://visibiapp-production.up.railway.app` when `VITE_API_URL` is not set). Those actions are not WordPress content endpoints.

WordPress admin credentials are kept in the ignored `wordpress-cms/.env.production.local` file in the WSL checkout. Never commit that file or put its password in documentation. Production's canonical URL and `www` redirect are configured on the Railway WordPress service. Cloudflare DNS and Railway custom domains must both point to that service.

### Current migration cleanup

The original `Visibi Primary` menu was seeded while WordPress used its temporary Railway hostname. Eight saved menu URLs still contain that hostname, and Yoast's cached canonical URLs also show it on existing pages/posts. These need a controlled production content/SEO update and verification; changing the WordPress site URL alone did not rewrite saved menu URLs or Yoast indexables. Contact Form 7 is installed, but mail delivery/SMTP still needs configuration before depending on email notifications.

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

Run `npm run cms:extract` in `frontend` after changing existing React page source, then `npm run build:wordpress`. The content manifest is tracked at `wordpress-cms/visibi-content/content-manifest.json`. The Docker database, uploads, installed third-party plugin files, and `wordpress-cms/.env` are local and untracked. Production is deployed on the dedicated Railway project; keep application, DNS, and database changes in the appropriate reviewed workflow.
