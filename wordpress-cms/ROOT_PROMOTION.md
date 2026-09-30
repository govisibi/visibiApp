# Govisibi root launch

The approved VISIBI WordPress content remains in the `v2_` MySQL tables. On startup, `entrypoint.sh` copies its theme, MU plugins and uploads to the domain root, installs `root-config.php`, enables indexing, updates stored preview URLs with `promote-root.php`, and adds permanent redirects from `/v2/` and the relevant legacy root URLs. The `wp_` legacy tables and the old root files remain during initial verification.

The complete prelaunch database backup is held outside the repository in the Govisibi client backup directory. The old root uploads have a separate backup there. The backup archive checksum is `441c21dfb6c1d10674e0f043be66c010b39db2fb902dab6d48f1af3f911dbe4f`.

After deployment, run `node v2/_migration/audit-live-parity.js https://govisibi.ai` and `node v2/_migration/check-promotion-interactions.js https://govisibi.ai`. Verify `/wp-admin/` login, contact submission and Enquiries, `/robots.txt`, `/sitemap_index.xml`, canonical URLs, legacy redirects, and `/v2/` redirects. Only then remove the legacy `wp_` tables, React theme/plugin files and copied `/v2/` core using a separate scoped cleanup change.

Rollback before legacy cleanup: redeploy the last preview image, which retains the old root files and `wp_` tables. The database backup is available if the URL migration must also be reversed. After legacy cleanup, restore the backup and old root files from the isolated Govisibi backups before redeploying the old image.
