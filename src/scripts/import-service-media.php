<?php
/** Assign the approved editorial covers to existing service-page media slots. */
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

$images = array(
    'adobe-commerce-on-prem' => array( 'case-adobeOnprem' => 'Pharmaceutical distribution workspace and packing desk' ),
    'magento-open-source' => array( 'case-magentoOS' => 'Outdoor equipment retail showroom' ),
    'shopify-plus' => array( 'case-shopifyPlus' => 'Skincare ecommerce packing studio' ),
    'woocommerce' => array( 'case-woo' => 'Independent coffee roastery packing desk' ),
    'ecommerce-development' => array(
        'case-feature' => 'Ecommerce operations studio and product catalogue workstation',
        'insight-a' => 'Two ecommerce catalogue workstations in a studio',
        'insight-b' => 'Ecommerce agency workspace with wireframes',
        'insight-c' => 'Development workstation with performance charts',
    ),
    'marketing-and-seo' => array( 'case-marketing' => 'Ecommerce marketing workspace with analytics', ),
);
$asset_dir = get_stylesheet_directory() . '/assets/service-media/';
$pages = array();
$pending = array();
foreach ( $images as $slug => $slots ) {
    $page = get_page_by_path( $slug );
    if ( ! $page || $page->post_status !== 'publish' ) {
        fwrite( STDERR, "Expected published page missing: $slug\n" );
        exit( 1 );
    }
    $pages[ $slug ] = $page;
    $assigned = get_post_meta( $page->ID, '_visibi_media_slots', true );
    if ( ! is_array( $assigned ) ) { $assigned = array(); }
    foreach ( $slots as $slot => $alt ) {
        if ( substr_count( $page->post_content, 'data-visibi-slot="' . $slot . '"' ) !== 1 ) {
            fwrite( STDERR, "Media slot missing or duplicated: $slug / $slot\n" );
            exit( 1 );
        }
        $file = $asset_dir . $slot . '.jpg';
        $size = is_readable( $file ) ? getimagesize( $file ) : false;
        if ( ! $size || $size[0] !== 1200 || $size[1] !== 675 || $size['mime'] !== 'image/jpeg' ) {
            fwrite( STDERR, "Image missing or wrong dimensions: $slot\n" );
            exit( 1 );
        }
        if ( empty( $assigned[ $slot ] ) || ! wp_attachment_is_image( (int) $assigned[ $slot ] ) ) {
            $pending[ $slug ][ $slot ] = $alt;
        }
    }
}

echo 'Service media: ' . count( $images ) . ' pages, ' . array_sum( array_map( 'count', $pending ) ) . " empty slots\n";
if ( $dry_run || ! $pending ) { exit( 0 ); }

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

foreach ( $pending as $slug => $slots ) {
    $page = $pages[ $slug ];
    $assigned = get_post_meta( $page->ID, '_visibi_media_slots', true );
    if ( ! is_array( $assigned ) ) { $assigned = array(); }
    foreach ( $slots as $slot => $alt ) {
        $key = $slug . '/' . $slot;
        $existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_service_media_key', 'meta_value' => $key, 'posts_per_page' => 1, 'fields' => 'ids' ) );
        $id = $existing ? (int) $existing[0] : 0;
        if ( ! $id || ! wp_attachment_is_image( $id ) ) {
            $file = $asset_dir . $slot . '.jpg';
            $temporary = wp_tempnam( basename( $file ) );
            if ( ! $temporary || ! copy( $file, $temporary ) ) {
                fwrite( STDERR, "Could not stage image: $key\n" );
                exit( 1 );
            }
            $id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $temporary ), $page->ID, $alt );
            if ( is_wp_error( $id ) ) {
                @unlink( $temporary );
                fwrite( STDERR, "Could not import image: $key\n" );
                exit( 1 );
            }
            update_post_meta( $id, '_visibi_service_media_key', $key );
            update_post_meta( $id, '_wp_attachment_image_alt', $alt );
        }
        $assigned[ $slot ] = $id;
    }
    update_post_meta( $page->ID, '_visibi_media_slots', $assigned );
    echo 'Assigned ' . count( $slots ) . ' image(s) on ' . $slug . "\n";
}
