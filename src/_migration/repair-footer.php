<?php
/** Add the omitted SiteFooter links to the existing editable WordPress menu once. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
require dirname(__DIR__) . '/wp-load.php';
if (get_option('visibi_v2_footer_version') === '2') { exit("Preview footer already repaired\n"); }
$menu = wp_get_nav_menu_object('VISIBI Footer 2026');
if (!$menu) { fwrite(STDERR, "Preview footer menu is missing\n"); exit(1); }
$items = (array) wp_get_nav_menu_items($menu->term_id);
$groups = array();
foreach ($items as $item) {
    if (!$item->menu_item_parent) { $groups[$item->title] = $item->ID; }
}
if (empty($groups['Company']) || empty($groups['Ecommerce'])) { fwrite(STDERR, "Preview footer groups are incomplete\n"); exit(1); }
$company = array();
foreach ($items as $item) {
    if ((int) $item->menu_item_parent === (int) $groups['Company']) { $company[$item->title] = $item; }
    if ((int) $item->menu_item_parent === (int) $groups['Ecommerce'] && $item->title === 'Ecommerce') {
        wp_update_post(array('ID' => $item->ID, 'post_title' => 'All ecommerce →'));
    }
}
foreach (array('Our team' => '/about/#team', 'Careers' => '/careers/', 'Pay an invoice' => '/pay-invoice/') as $label => $path) {
    if (isset($company[$label])) { continue; }
    $item_id = wp_update_nav_menu_item($menu->term_id, 0, array(
        'menu-item-title' => $label,
        'menu-item-url' => home_url($path),
        'menu-item-type' => 'custom',
        'menu-item-parent-id' => $groups['Company'],
        'menu-item-status' => 'publish',
    ));
    if (is_wp_error($item_id)) { fwrite(STDERR, "Could not add footer link: $label\n"); exit(1); }
    $company[$label] = wp_setup_nav_menu_item(get_post($item_id));
}
if (isset($company['Book a meeting'])) {
    $old = $company['Book a meeting'];
    $result = wp_update_nav_menu_item($menu->term_id, $old->ID, array(
        'menu-item-title' => 'Book a meeting',
        'menu-item-url' => home_url('/about/#meet'),
        'menu-item-type' => 'custom',
        'menu-item-parent-id' => $groups['Company'],
        'menu-item-status' => 'publish',
    ));
    if (is_wp_error($result)) { fwrite(STDERR, "Could not repair meeting link\n"); exit(1); }
}
$order = array('About us', 'Our team', 'Success stories', 'Insights & guides', 'Book a meeting', 'Careers', 'Contact', 'Pay an invoice');
$base = min(array_map(function ($item) { return (int) $item->menu_order; }, $company));
foreach ($order as $index => $label) {
    if (isset($company[$label])) { wp_update_post(array('ID' => $company[$label]->ID, 'menu_order' => $base + $index)); }
}
update_option('visibi_v2_footer_version', '2');
echo "Preview footer matches approved SiteFooter links\n";
