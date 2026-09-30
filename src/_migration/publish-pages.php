<?php
/** Publish the two approved preview pages and restore their sitemap links once. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
require dirname(__DIR__) . '/wp-load.php';
if (get_option('visibi_v2_publish_version') === '1') { exit("Preview pages already published\n"); }
foreach (array('careers', 'pay-invoice') as $slug) {
    $page = get_page_by_path($slug);
    if (!$page) { fwrite(STDERR, "Missing preview page: $slug\n"); exit(1); }
    if ($page->post_status !== 'publish') {
        $result = wp_update_post(array('ID' => $page->ID, 'post_status' => 'publish'), true);
        if (is_wp_error($result)) { fwrite(STDERR, "Could not publish preview page: $slug\n"); exit(1); }
    }
}
$sitemap = get_page_by_path('sitemap');
if (!$sitemap) { fwrite(STDERR, "Preview sitemap page is missing\n"); exit(1); }
if (strpos($sitemap->post_content, '/careers/') === false || strpos($sitemap->post_content, '/pay-invoice/') === false) {
    $items = json_decode(file_get_contents(dirname(__DIR__) . '/content.json'), true);
    foreach ($items as $item) {
        if ($item['name'] !== 'Sitemap') { continue; }
        $result = wp_update_post(array('ID' => $sitemap->ID, 'post_content' => '<!-- wp:html -->' . "\n" . $item['html'] . "\n" . '<!-- /wp:html -->'), true);
        if (is_wp_error($result)) { fwrite(STDERR, "Could not restore preview sitemap links\n"); exit(1); }
        break;
    }
}
update_option('visibi_v2_publish_version', '1');
echo "Careers and Pay Invoice are published\n";
