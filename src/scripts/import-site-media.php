<?php
/** Import the approved Insights and Adobe Commerce images into WordPress Media. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$dry_run = in_array( '--dry-run', $argv, true );
$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

if ( $GLOBALS['wpdb']->prefix !== 'v2_' || untrailingslashit( home_url() ) !== $site_url ) {
    fwrite( STDERR, "Refusing to update an unexpected WordPress installation\n" );
    exit( 1 );
}

$post = get_page_by_path( 'stop-stock-integrations-triggering-full-magento-reindexing', OBJECT, 'post' );
$page = get_page_by_path( 'adobe-commerce-cloud' );
if ( ! $post || $post->post_status !== 'publish' || ! $page || $page->post_status !== 'publish' ) {
    fwrite( STDERR, "Expected published Insights post or Adobe Commerce page missing\n" );
    exit( 1 );
}

$assets = get_stylesheet_directory() . '/assets/';
$insights_file = $assets . 'insights-covers/stop-stock-integrations-triggering-full-magento-reindexing.jpg';
$meridian_file = $assets . 'case-studies/meridian-industrial-storefront.jpg';
foreach ( array( $insights_file => array( 460, 259 ), $meridian_file => array( 1600, 900 ) ) as $file => $dimensions ) {
    $size = is_readable( $file ) ? getimagesize( $file ) : false;
    if ( ! $size || $size[0] !== $dimensions[0] || $size[1] !== $dimensions[1] || $size['mime'] !== 'image/jpeg' ) {
        fwrite( STDERR, "Release image missing or wrong dimensions: $file\n" );
        exit( 1 );
    }
}

$slots = get_post_meta( $page->ID, '_visibi_media_slots', true );
if ( ! is_array( $slots ) ) { $slots = array(); }
$insights_current = get_post_thumbnail_id( $post->ID );
$meridian_current = isset( $slots['case-adobeCloud'] ) ? absint( $slots['case-adobeCloud'] ) : 0;
if ( $dry_run ) {
    echo 'Dry run: Insights post ' . $post->ID . ' featured image ' . ( $insights_current ?: 'empty' ) . PHP_EOL;
    echo 'Dry run: Adobe Commerce page ' . $page->ID . ' Meridian slot ' . ( $meridian_current ?: 'empty' ) . PHP_EOL;
    exit( 0 );
}
if ( get_option( 'visibi_site_media_release_20261001' ) === '1' ) {
    echo "Site media release already applied\n";
    exit( 0 );
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

function visibi_import_release_image( $file, $owner_id, $key, $description, $alt ) {
    $existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_release_image', 'meta_value' => $key, 'posts_per_page' => 1, 'fields' => 'ids' ) );
    if ( $existing ) { return (int) $existing[0]; }
    $temporary = wp_tempnam( basename( $file ) );
    if ( ! $temporary || ! copy( $file, $temporary ) ) { return new WP_Error( 'visibi_media_copy', 'Could not stage ' . $key ); }
    $id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $temporary ), $owner_id, $description );
    if ( is_wp_error( $id ) ) { @unlink( $temporary ); return $id; }
    update_post_meta( $id, '_visibi_release_image', $key );
    update_post_meta( $id, '_wp_attachment_image_alt', $alt );
    return $id;
}

if ( ! $insights_current ) {
    $id = visibi_import_release_image( $insights_file, $post->ID, 'insights-magento-stock', 'Magento stock integration article cover', 'Warehouse stock scanner and inventory laptop' );
    if ( is_wp_error( $id ) || ! set_post_thumbnail( $post->ID, $id ) ) {
        fwrite( STDERR, "Could not assign Insights featured image\n" );
        exit( 1 );
    }
    echo 'Set Insights featured image to attachment ' . $id . PHP_EOL;
} else {
    echo 'Kept existing Insights featured image ' . $insights_current . PHP_EOL;
}

if ( ! $meridian_current ) {
    $id = visibi_import_release_image( $meridian_file, $page->ID, 'meridian-storefront', 'Meridian Industrial storefront concept image', 'Industrial supply ecommerce catalogue on a warehouse desk' );
    if ( is_wp_error( $id ) ) { fwrite( STDERR, "Could not import Meridian image\n" ); exit( 1 ); }
    $slots['case-adobeCloud'] = $id;
    update_post_meta( $page->ID, '_visibi_media_slots', $slots );
    echo 'Set Meridian image slot to attachment ' . $id . PHP_EOL;
} else {
    echo 'Kept existing Meridian image slot ' . $meridian_current . PHP_EOL;
}

update_option( 'visibi_site_media_release_20261001', '1', false );
