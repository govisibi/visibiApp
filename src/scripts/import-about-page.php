<?php
/** Apply the approved local About page content once on production. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$dry_run = in_array( '--dry-run', $argv, true );
$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

if ( $GLOBALS['wpdb']->prefix !== 'v2_' ) {
    fwrite( STDERR, "Refusing to update an unexpected WordPress table prefix\n" );
    exit( 1 );
}
if ( ! $dry_run && ( untrailingslashit( home_url() ) !== 'https://govisibi.ai' || get_option( 'visibi_root_promotion_version' ) !== '1' ) ) {
    fwrite( STDERR, "Refusing to update an unexpected WordPress installation\n" );
    exit( 1 );
}

$page = get_page_by_path( 'about' );
if ( ! $page || $page->post_status !== 'publish' ) {
    fwrite( STDERR, "Published About page missing\n" );
    exit( 1 );
}
$content = file_get_contents( '/opt/visibi/about-content.html' );
if ( ! is_string( $content ) || ! str_contains( $content, 'team-originals/Sophia%20Malik.png' )
    || ! str_contains( $content, 'team-originals/Saeed%20Ak.png' )
    || ! str_contains( $content, '<div data-visibi-form="1"></div>' )
    || str_contains( $content, 'localhost' ) ) {
    fwrite( STDERR, "About page source failed validation\n" );
    exit( 1 );
}

$marker = 'visibi_about_release_20261001';
if ( get_option( $marker ) === '1' ) {
    echo "About page release already applied\n";
    exit( 0 );
}
if ( $dry_run ) {
    echo 'Dry run: published page ' . $page->ID . ', content SHA-256 ' . hash( 'sha256', $content ) . "\n";
    exit( 0 );
}

add_post_meta( $page->ID, '_visibi_about_pre_release_20261001', $page->post_content, true );
$result = wp_update_post( array( 'ID' => $page->ID, 'post_content' => $content ), true );
if ( is_wp_error( $result ) ) {
    fwrite( STDERR, $result->get_error_message() . "\n" );
    exit( 1 );
}
update_option( $marker, '1', false );
echo 'About page release applied to page ' . $result . "\n";
