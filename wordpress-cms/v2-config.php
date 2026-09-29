<?php
// The /v2 install has its own database and receives credentials only at runtime.
foreach (array('HOST', 'NAME', 'USER', 'PASSWORD') as $key) {
    if (!getenv('VISIBI_V2_DB_' . $key)) {
        http_response_code(503);
        exit('Preview database is not configured.');
    }
}
define('DB_NAME', getenv('VISIBI_V2_DB_NAME'));
define('DB_USER', getenv('VISIBI_V2_DB_USER'));
define('DB_PASSWORD', getenv('VISIBI_V2_DB_PASSWORD'));
define('DB_HOST', getenv('VISIBI_V2_DB_HOST'));
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');
define('WP_HOME', 'https://govisibi.ai/v2');
define('WP_SITEURL', 'https://govisibi.ai/v2');
define('DISALLOW_FILE_EDIT', true);
define('WP_DEBUG', false);
$table_prefix = 'wp_';
$secret = getenv('VISIBI_V2_AUTH_SECRET');
if (!$secret) { http_response_code(503); exit('Preview secret is not configured.'); }
foreach (array('AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT') as $name) {
    define($name, hash_hmac('sha256', $name, $secret));
}
if (!defined('ABSPATH')) { define('ABSPATH', __DIR__ . '/'); }
require_once ABSPATH . 'wp-settings.php';
