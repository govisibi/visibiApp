<?php
/** Import the nine Success Stories card images into the WordPress media slots. */
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

$page = get_page_by_path( 'success-stories' );
if ( ! $page || $page->post_status !== 'publish' ) {
    fwrite( STDERR, "Published Success Stories page missing\n" );
    exit( 1 );
}

$alt = array(
    'story-s1' => 'Contemporary furniture showroom with a mobile catalogue',
    'story-s2' => 'Fashion studio with clothing and an ecommerce workstation',
    'story-s3' => 'Homeware products beside an ecommerce catalogue',
    'story-s4' => 'Server room and cloud operations workstation',
    'story-s5' => 'Sports retailer fulfilment warehouse',
    'story-s6' => 'Beauty ecommerce order packing station',
    'story-s7' => 'Delivery depot with a dispatch tablet',
    'story-s8' => 'Professional services office with an enquiry inbox',
    'story-s9' => 'Industrial distributor stockroom and inventory workstation',
);
$asset_dir = get_stylesheet_directory() . '/assets/success-stories/';
foreach ( $alt as $slot => $description ) {
    if ( substr_count( $page->post_content, 'data-visibi-slot="' . $slot . '"' ) !== 1 ) {
        fwrite( STDERR, "Success Stories slot missing or duplicated: $slot\n" );
        exit( 1 );
    }
    $file = $asset_dir . $slot . '.jpg';
    $size = is_readable( $file ) ? getimagesize( $file ) : false;
    if ( ! $size || $size[0] !== 1200 || $size[1] !== 600 || $size['mime'] !== 'image/jpeg' ) {
        fwrite( STDERR, "Story image missing or wrong dimensions: $slot\n" );
        exit( 1 );
    }
}

$assigned = get_post_meta( $page->ID, '_visibi_media_slots', true );
if ( ! is_array( $assigned ) ) { $assigned = array(); }
$missing = array_filter( array_keys( $alt ), function ( $slot ) use ( $assigned ) {
    return empty( $assigned[ $slot ] ) || ! wp_attachment_is_image( (int) $assigned[ $slot ] );
} );
if ( $dry_run ) {
    echo 'Dry run: Success Stories page ' . $page->ID . ', ' . count( $missing ) . ' of 9 slots need images' . PHP_EOL;
    exit( 0 );
}
if ( get_option( 'visibi_success_stories_images_20261002' ) === '1' ) {
    echo "Success Stories images already imported\n";
    exit( 0 );
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

foreach ( $missing as $slot ) {
    $existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_success_story_image', 'meta_value' => $slot, 'posts_per_page' => 1, 'fields' => 'ids' ) );
    $id = $existing ? (int) $existing[0] : 0;
    if ( ! $id ) {
        $file = $asset_dir . $slot . '.jpg';
        $temporary = wp_tempnam( basename( $file ) );
        if ( ! $temporary || ! copy( $file, $temporary ) ) {
            fwrite( STDERR, "Could not stage story image: $slot\n" );
            exit( 1 );
        }
        $id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $temporary ), $page->ID, $alt[ $slot ] );
        if ( is_wp_error( $id ) ) {
            @unlink( $temporary );
            fwrite( STDERR, "Could not import story image: $slot\n" );
            exit( 1 );
        }
        update_post_meta( $id, '_visibi_success_story_image', $slot );
        update_post_meta( $id, '_wp_attachment_image_alt', $alt[ $slot ] );
    }
    $assigned[ $slot ] = $id;
}

update_post_meta( $page->ID, '_visibi_media_slots', $assigned );
update_option( 'visibi_success_stories_images_20261002', '1', false );
echo 'Success Stories images assigned: ' . count( $missing ) . ' new slots on page ' . $page->ID . PHP_EOL;
