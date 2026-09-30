# Govisibi root launch

The approved VISIBI WordPress content remains in the `v2_` MySQL tables. The root site uses the same database, theme, and WordPress media library. Root configuration and HTTPS redirects from `/v2/` and relevant legacy URLs are source controlled. At the owner's request, `robots.txt` disallows all crawlers at the root.

The complete prelaunch database backup is held outside the repository in the Govisibi client backup directory. The old root uploads have a separate backup there. The backup archive checksum is `441c21dfb6c1d10674e0f043be66c010b39db2fb902dab6d48f1af3f911dbe4f`.

The live parity audit checked 172 pages, 798 internal links, and nine assets with no errors, warnings, or broken links. Browser checks passed the AI Agents, service, promo, and form interactions. The next deployment imports the supplied named team photos into WordPress Media, adds local AI platform logos to the home strip, then removes the exact inventoried 18 legacy `wp_` tables and obsolete root files. The migration refuses an unexpected table inventory or WordPress installation. The old database and uploads were backed up before root promotion.

Rollback to the legacy root after cleanup requires restoring only the legacy `wp_` tables and old root files from the isolated backups before redeploying the legacy image. Preserve the live `v2_` tables, which hold new enquiries and current site edits. Routine changes to the current site can be rolled back through a source-controlled revert.
