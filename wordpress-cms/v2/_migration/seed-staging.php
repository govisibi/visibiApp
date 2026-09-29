<?php
/** Seed content only after the preview WordPress install has succeeded. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
require dirname(__DIR__) . '/wp-load.php';
if (!is_blog_installed()) { exit("Preview WordPress is not installed\n"); }
if (get_option('visibi_v2_seed_version') === '1') { exit("Preview content already seeded\n"); }
require __DIR__ . '/import.php';
$pages = wp_count_posts('page');
$posts = wp_count_posts('post');
$page_total = (int) $pages->publish + (int) $pages->draft;
$post_total = (int) $posts->publish + (int) $posts->draft;
if ($page_total < 84 || $post_total < 90) {
    fwrite(STDERR, "Preview import is incomplete: {$page_total} pages and {$post_total} posts\n");
    exit(1);
}
update_option('visibi_v2_seed_version', '1');
