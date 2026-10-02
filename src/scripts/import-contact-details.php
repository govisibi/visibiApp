<?php
/** Add the approved telephone number and London office to the Contact page. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$dry_run = in_array( '--dry-run', $argv, true );
$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

global $wpdb;
if ( $wpdb->prefix !== 'v2_' || untrailingslashit( home_url() ) !== $site_url ) {
    fwrite( STDERR, "Refusing to update an unexpected WordPress installation\n" );
    exit( 1 );
}

$page = get_page_by_path( 'contact' );
if ( ! $page || $page->post_status !== 'publish' ) {
    fwrite( STDERR, "Published Contact page missing\n" );
    exit( 1 );
}

$content = $page->post_content;
$has_phone = str_contains( $content, 'tel:+442080588027' );
$has_address = str_contains( $content, '167–169 Great Portland Street' );
if ( $has_phone && $has_address ) {
    echo "Contact details already present\n";
    exit( 0 );
}
if ( $has_phone || $has_address ) {
    fwrite( STDERR, "Contact details are partially present; leaving the page unchanged\n" );
    exit( 1 );
}

$needle = '<span style="font-weight: 600;">hello@govisibi.ai</span></div>';
if ( substr_count( $content, $needle ) !== 1 || substr_count( $content, 'id="call"' ) !== 1 ) {
    fwrite( STDERR, "Expected Contact page layout changed; leaving it unchanged\n" );
    exit( 1 );
}

$details = <<<'HTML'

        <div style="display: flex; justify-content: space-between; gap: 16px; padding: 16px 0px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); font-size: 15px; flex-wrap: wrap;"><span style="color: rgb(142, 154, 182);">Phone</span><a href="tel:+442080588027" style="color: rgb(255, 255, 255); font-weight: 600; margin-left: auto;">020 8058 8027</a></div>
        <div style="display: flex; justify-content: space-between; gap: 16px; padding: 16px 0px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); font-size: 15px; flex-wrap: wrap;"><span style="color: rgb(142, 154, 182);">London office</span><address style="font-style: normal; font-weight: 600; line-height: 1.5; text-align: right; margin-left: auto;">167–169 Great Portland Street<br>5th Floor<br>London W1W 5PF</address></div>
HTML;

if ( $dry_run ) {
    echo 'Dry run: Contact page ' . $page->ID . " needs phone and address\n";
    exit( 0 );
}

$updated = str_replace( $needle, $needle . $details, $content );
add_post_meta( $page->ID, '_visibi_contact_before_details_20261003', $content, true );
if ( $wpdb->update( $wpdb->posts, array( 'post_content' => $updated ), array( 'ID' => $page->ID ), array( '%s' ), array( '%d' ) ) !== 1 ) {
    fwrite( STDERR, "Could not update Contact page: {$wpdb->last_error}\n" );
    exit( 1 );
}
clean_post_cache( $page->ID );
wp_cache_flush();
echo 'Contact details added to page ' . $page->ID . PHP_EOL;
