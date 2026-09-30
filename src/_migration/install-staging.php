<?php
/** Install and seed the approved /v2 preview once; rerun safely after a container restart. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
define('WP_INSTALLING', true);
$_SERVER['HTTP_HOST'] = 'govisibi.ai';
$_SERVER['HTTPS'] = 'on';
require dirname(__DIR__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
if (is_blog_installed()) { exit("Preview already installed\n"); }
$root_prefix = govisibi_v2_env('WORDPRESS_TABLE_PREFIX', 'wp_');
if (!preg_match('/^[A-Za-z0-9_]+$/', $root_prefix) || !preg_match('/^[A-Za-z0-9_]+$/', DB_NAME) || $root_prefix === $wpdb->prefix) {
    fwrite(STDERR, "Invalid or conflicting root table prefix\n"); exit(1);
}
$users_table = '`' . DB_NAME . '`.`' . $root_prefix . 'users`';
$meta_table = '`' . DB_NAME . '`.`' . $root_prefix . 'usermeta`';
$sql = $wpdb->prepare(
    "SELECT u.user_login, u.user_pass FROM $users_table u JOIN $meta_table m ON m.user_id=u.ID WHERE m.meta_key=%s AND m.meta_value LIKE %s ORDER BY u.ID LIMIT 1",
    $root_prefix . 'capabilities', '%administrator%'
);
$admin = $wpdb->get_row($sql);
if (!$admin) { fwrite(STDERR, "Root administrator was not found\n"); exit(1); }
$result = wp_install('Govisibi v2 Preview', $admin->user_login, 'info@govisibi.ai', false, '', wp_generate_password(40, true, true), 'en_US');
if (empty($result['user_id'])) { exit("Preview installation failed\n"); }
$wpdb->update($wpdb->users, array('user_pass' => $admin->user_pass), array('ID' => (int) $result['user_id']), array('%s'), array('%d'));
clean_user_cache((int) $result['user_id']);
update_option('admin_email', 'info@govisibi.ai');
update_option('blog_public', 0);
update_option('permalink_structure', '/%postname%/');
switch_theme('visibi');
require_once ABSPATH . 'wp-admin/includes/plugin.php';
if (file_exists(WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php')) { activate_plugin('wordpress-seo/wp-seo.php'); }
echo "Preview WordPress installed\n";
