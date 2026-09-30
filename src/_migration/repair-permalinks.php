<?php
/** Repair the initial import's stale rewrite rules without touching root tables. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
require dirname(__DIR__) . '/wp-load.php';
if (!is_blog_installed()) { fwrite(STDERR, "Preview WordPress is not installed\n"); exit(1); }
if (get_option('visibi_v2_permalink_version') === '2') { exit("Preview permalinks ready\n"); }
global $wp_rewrite;
$wp_rewrite->set_permalink_structure('/insights/%postname%/');
flush_rewrite_rules(false);
update_option('visibi_v2_permalink_version', '2');
echo "Preview article permalinks repaired\n";
