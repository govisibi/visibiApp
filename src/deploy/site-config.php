<?php
/** Govisibi root WordPress, promoted from the approved VISIBI preview. */
function govisibi_root_env($name, $default = false) {
    $file = getenv($name . '_FILE');
    if ($file) {
        if (!is_readable($file)) { http_response_code(503); exit('Database configuration is unavailable.'); }
        return rtrim(file_get_contents($file), "\r\n");
    }
    $value = getenv($name);
    return $value !== false ? $value : $default;
}
foreach (array('WORDPRESS_DB_HOST', 'WORDPRESS_DB_NAME', 'WORDPRESS_DB_USER', 'WORDPRESS_DB_PASSWORD') as $name) {
    if (!govisibi_root_env($name)) { http_response_code(503); exit('Database is not configured.'); }
}
define('DB_NAME', govisibi_root_env('WORDPRESS_DB_NAME'));
define('DB_USER', govisibi_root_env('WORDPRESS_DB_USER'));
define('DB_PASSWORD', govisibi_root_env('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', govisibi_root_env('WORDPRESS_DB_HOST'));
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');
define('WP_HOME', 'https://govisibi.ai');
define('WP_SITEURL', 'https://govisibi.ai');
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strpos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) {
    $_SERVER['HTTPS'] = 'on';
}
define('DISALLOW_FILE_EDIT', true);
define('WP_DEBUG', false);
$table_prefix = 'v2_';
if ($table_prefix === govisibi_root_env('WORDPRESS_TABLE_PREFIX', 'wp_')) {
    http_response_code(503);
    exit('The promoted table prefix conflicts with legacy WordPress.');
}
$secret = govisibi_root_env('VISIBI_V2_AUTH_SECRET', DB_PASSWORD);
foreach (array('AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT') as $name) {
    define($name, hash_hmac('sha256', $name, $secret));
}
if (!defined('ABSPATH')) { define('ABSPATH', __DIR__ . '/'); }
require_once ABSPATH . 'wp-settings.php';
