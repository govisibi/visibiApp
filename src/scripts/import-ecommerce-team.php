<?php
/** Reuse the named About-page team and their original portraits on Ecommerce Development. */
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

$page = get_page_by_path( 'ecommerce-development' );
if ( ! $page || $page->post_status !== 'publish' ) {
    fwrite( STDERR, "Published Ecommerce Development page missing\n" );
    exit( 1 );
}
$page_id = $page->ID;

$team = array(
    'team-a' => array( 'Daniel Mercer', 'Michael Turner', 'Lead Adobe Commerce Architect', 'Head of Ecommerce Engineering', '<span>22</span> YRS', '<span>ECOMMERCE</span>', 'MAGENTO · HYVÄ · B2B', 'ADOBE COMMERCE · SHOPIFY PLUS' ),
    'team-b' => array( 'Sophie Lang', 'Wei Ling Tan', 'Head of Shopify Engineering', 'Solutions Architect', '<span>20</span> YRS', '<span>ARCHITECTURE</span>', 'SHOPIFY PLUS · HYDROGEN', 'CLOUD · ECOMMERCE' ),
    'team-c' => array( 'Marcus Webb', 'Arjun Mehta', 'Principal WordPress Developer', 'Senior Full-stack Engineer', '<span>21</span> YRS', '<span>FULL-STACK</span>', 'WOOCOMMERCE · HEADLESS WP', 'LARAVEL · REACT' ),
    'team-d' => array( 'Aisha Rahman', 'Layla Haddad', 'Director of UX &amp; CRO', 'Client Success Director', '<span>18</span> YRS', '<span>CLIENT SUCCESS</span>', 'RESEARCH · A/B TESTING', 'DELIVERY · SUPPORT' ),
);
$content = $page->post_content;
$assigned = get_post_meta( $page->ID, '_visibi_media_slots', true );
if ( ! is_array( $assigned ) ) { $assigned = array(); }
$pending = array();
foreach ( $team as $slot => $person ) {
    if ( substr_count( $content, 'data-visibi-slot="' . $slot . '"' ) !== 1 ) {
        fwrite( STDERR, "Team slot missing or duplicated: $slot\n" );
        exit( 1 );
    }
    $file = get_stylesheet_directory() . '/assets/team-originals/' . $person[1] . '.png';
    $size = is_readable( $file ) ? getimagesize( $file ) : false;
    if ( ! $size || $size['mime'] !== 'image/png' ) {
        fwrite( STDERR, "Original About-page portrait missing: $slot\n" );
        exit( 1 );
    }
    if ( substr_count( $content, $person[0] ) === 1 ) {
        foreach ( array( 2, 4, 6 ) as $index ) {
            if ( substr_count( $content, $person[ $index ] ) < 1 ) {
                fwrite( STDERR, "Expected team-card copy missing: $slot / $index\n" );
                exit( 1 );
            }
        }
    } elseif ( substr_count( $content, $person[1] ) !== 1 ) {
        fwrite( STDERR, "Unexpected team-card name state: $slot\n" );
        exit( 1 );
    }
    if ( empty( $assigned[ $slot ] ) || ! wp_attachment_is_image( (int) $assigned[ $slot ] ) ) {
        $pending[ $slot ] = $person;
    }
}

echo 'Ecommerce team: ' . count( $pending ) . " empty portraits\n";
if ( $dry_run ) { exit( 0 ); }

foreach ( $team as $person ) {
    if ( substr_count( $content, $person[0] ) !== 1 ) { continue; }
    foreach ( array( array( 0, 1 ), array( 2, 3 ), array( 4, 5 ), array( 6, 7 ) ) as $pair ) {
        $content = str_replace( $person[ $pair[0] ], $person[ $pair[1] ], $content );
    }
}
if ( $content !== $page->post_content ) {
    $result = wp_update_post( array( 'ID' => $page->ID, 'post_content' => $content ), true );
    if ( is_wp_error( $result ) ) {
        fwrite( STDERR, "Could not update team-card copy\n" );
        exit( 1 );
    }
}
if ( ! $pending ) { exit( 0 ); }

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
foreach ( $pending as $slot => $person ) {
    $existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_ecommerce_team_slot', 'meta_value' => $slot, 'posts_per_page' => 1, 'fields' => 'ids' ) );
    $id = $existing ? (int) $existing[0] : 0;
    if ( ! $id || ! wp_attachment_is_image( $id ) ) {
        $file = get_stylesheet_directory() . '/assets/team-originals/' . $person[1] . '.png';
        $temporary = wp_tempnam( basename( $file ) );
        if ( ! $temporary || ! copy( $file, $temporary ) ) {
            fwrite( STDERR, "Could not stage team portrait: $slot\n" );
            exit( 1 );
        }
        $id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $temporary ), $page_id, $person[1] );
        if ( is_wp_error( $id ) ) {
            @unlink( $temporary );
            fwrite( STDERR, "Could not import team portrait: $slot\n" );
            exit( 1 );
        }
        update_post_meta( $id, '_visibi_ecommerce_team_slot', $slot );
        update_post_meta( $id, '_wp_attachment_image_alt', $person[1] );
    }
    if ( (int) get_post_field( 'post_parent', $id ) !== $page_id ) {
        wp_update_post( array( 'ID' => $id, 'post_parent' => $page_id ) );
    }
    $assigned[ $slot ] = $id;
}
update_post_meta( $page_id, '_visibi_media_slots', $assigned );
echo 'Assigned ' . count( $pending ) . " About-page portraits\n";
