<?php
/** Activate the local copy of Yoast SEO in the /v2 preview. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
require dirname( __DIR__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
if ( ! defined( 'WP_HOME' ) || WP_HOME !== 'http://localhost:8082/v2' ) { exit( "Wrong preview install\n" ); }
$plugin = 'wordpress-seo/wp-seo.php';
$result = activate_plugin( $plugin );
if ( is_wp_error( $result ) ) { exit( $result->get_error_message() . "\n" ); }
echo is_plugin_active( $plugin ) ? "Yoast SEO active in /v2.\n" : "Yoast SEO activation failed.\n";
