<?php
/** Restore the exact approved page HTML after WordPress filtered the first import. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

global $wpdb;
if ( $wpdb->prefix !== 'v2_' || untrailingslashit( home_url() ) !== 'https://govisibi.ai'
    || get_option( 'visibi_root_promotion_version' ) !== '1' ) {
    fwrite( STDERR, "Refusing to change an unexpected WordPress installation\n" );
    exit( 1 );
}

$marker = 'visibi_exact_html_release_20261001';
if ( get_option( $marker ) === '1' ) {
    echo "Exact page HTML already restored\n";
    exit( 0 );
}

$pages = array(
    'about' => array( '/opt/visibi/about-content.html', 'ed5f3578b794df77c08fd263c115817f21f3b8715e305f9f46c9b28418b475d8' ),
    'peak-traffic-readiness' => array( '/opt/visibi/peak-content.html', '96c7aaae2f7f58fc31cbc7a344457e968499ddd6ccbca20250e1ddad35064037' ),
);

foreach ( $pages as $slug => $spec ) {
    $page = get_page_by_path( $slug );
    $content = file_get_contents( $spec[0] );
    if ( ! $page || $page->post_status !== 'publish' || ! is_string( $content )
        || ! str_contains( $content, '<!-- wp:html -->' ) || str_contains( $content, 'localhost' ) ) {
        fwrite( STDERR, "Page or source validation failed for $slug\n" );
        exit( 1 );
    }
    $current_hash = hash( 'sha256', $page->post_content );
    if ( $current_hash === hash( 'sha256', $content ) ) {
        echo "$slug already matches the approved source\n";
        continue;
    }
    if ( $current_hash !== $spec[1] ) {
        fwrite( STDERR, "Unexpected current HTML for $slug; leaving it unchanged\n" );
        exit( 1 );
    }
    add_post_meta( $page->ID, '_visibi_filtered_html_pre_restore_20261001', $page->post_content, true );
    if ( $wpdb->update( $wpdb->posts, array( 'post_content' => $content ), array( 'ID' => $page->ID ), array( '%s' ), array( '%d' ) ) !== 1 ) {
        fwrite( STDERR, "Database update failed for $slug: {$wpdb->last_error}\n" );
        exit( 1 );
    }
    clean_post_cache( $page->ID );
    echo "$slug exact HTML restored\n";
}
wp_cache_flush();
update_option( $marker, '1', false );
