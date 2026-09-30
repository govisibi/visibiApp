<?php
/** One-time, preview-only administrator reset requested by the site owner. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$password = trim( (string) getenv( 'VISIBI_V2_ADMIN_PASSWORD' ) );
if ( '' === $password ) { exit( "No preview password reset requested\n" ); }
require dirname( __DIR__ ) . '/wp-load.php';
global $wpdb;
if ( 'v2_' !== $wpdb->prefix || untrailingslashit( home_url() ) !== 'https://govisibi.ai/v2' ) {
    fwrite( STDERR, "Refusing administrator reset outside Govisibi /v2\n" );
    exit( 1 );
}
if ( get_option( 'visibi_v2_admin_reset_20260930' ) === '1' ) { exit( "Preview administrator already reset\n" ); }
if ( strlen( $password ) < 24 ) { fwrite( STDERR, "Preview password is too short\n" ); exit( 1 ); }
$admin = get_user_by( 'login', 'visibiadmin' );
if ( ! $admin || ! user_can( $admin, 'administrator' ) ) { fwrite( STDERR, "Preview administrator is missing\n" ); exit( 1 ); }
wp_set_password( $password, $admin->ID );
update_option( 'visibi_v2_admin_reset_20260930', '1' );
echo "Preview administrator password updated\n";
