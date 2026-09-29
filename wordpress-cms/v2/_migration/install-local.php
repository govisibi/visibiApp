<?php
/** One-time local Docker preview bootstrap. Run inside the WordPress container. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
define( 'WP_INSTALLING', true );
$_SERVER['HTTP_HOST'] = 'localhost:8082';
require dirname( __DIR__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
if ( ! defined( 'WP_HOME' ) || 'http://localhost:8082/v2' !== WP_HOME ) { exit( "Wrong preview URL\n" ); }
if ( is_blog_installed() ) { exit( "Preview already installed\n" ); }

$root_db = getenv_docker( 'WORDPRESS_DB_NAME', 'wordpress' );
$root_prefix = getenv_docker( 'WORDPRESS_TABLE_PREFIX', 'wp_' );
if ( ! preg_match( '/^[A-Za-z0-9_]+$/', $root_db ) || ! preg_match( '/^[A-Za-z0-9_]+$/', $root_prefix ) ) {
    exit( "Invalid local database identifiers\n" );
}
$users = '`' . $root_db . '`.`' . $root_prefix . 'users`';
$meta = '`' . $root_db . '`.`' . $root_prefix . 'usermeta`';
$sql = $wpdb->prepare(
    "SELECT u.user_login, u.user_pass, u.user_email FROM $users u JOIN $meta m ON m.user_id=u.ID WHERE m.meta_key=%s AND m.meta_value LIKE %s ORDER BY u.ID LIMIT 1",
    $root_prefix . 'capabilities', '%administrator%'
);
$admin = $wpdb->get_row( $sql );
if ( ! $admin || ! is_email( $admin->user_email ) ) { exit( "No local WordPress administrator found\n" ); }

$result = wp_install( 'VISIBI v2 Preview', $admin->user_login, $admin->user_email, false, '', wp_generate_password( 40, true, true ), 'en_US' );
if ( empty( $result['user_id'] ) ) { exit( "WordPress install failed\n" ); }
$wpdb->update( $wpdb->users, array( 'user_pass' => $admin->user_pass ), array( 'ID' => (int) $result['user_id'] ), array( '%s' ), array( '%d' ) );
clean_user_cache( (int) $result['user_id'] );
update_option( 'admin_email', $admin->user_email );
update_option( 'blog_public', 0 );
switch_theme( 'visibi' );
flush_rewrite_rules();
echo "Installed isolated /v2 WordPress with the existing local administrator login and VISIBI theme.\n";
