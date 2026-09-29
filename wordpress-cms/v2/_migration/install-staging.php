<?php
/** Install and seed the approved /v2 preview once; rerun safely after a container restart. */
if (PHP_SAPI !== 'cli') { exit("CLI only\n"); }
if (!getenv('VISIBI_V2_DB_HOST')) { exit("Preview database is not configured\n"); }
define('WP_INSTALLING', true);
$_SERVER['HTTP_HOST'] = 'govisibi.ai';
$_SERVER['HTTPS'] = 'on';
require dirname(__DIR__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
if (is_blog_installed()) { exit("Preview already installed\n"); }
if (!getenv('VISIBI_V2_ADMIN_PASSWORD')) { fwrite(STDERR, "Preview admin password is not configured\n"); exit(1); }
$result = wp_install('Govisibi v2 Preview', 'govisibi_v2_admin', 'info@govisibi.ai', false, '', getenv('VISIBI_V2_ADMIN_PASSWORD'), 'en_US');
if (empty($result['user_id'])) { exit("Preview installation failed\n"); }
update_option('admin_email', 'info@govisibi.ai');
update_option('blog_public', 0);
update_option('permalink_structure', '/%postname%/');
switch_theme('visibi');
require_once ABSPATH . 'wp-admin/includes/plugin.php';
if (file_exists(WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php')) { activate_plugin('wordpress-seo/wp-seo.php'); }
echo "Preview WordPress installed\n";
