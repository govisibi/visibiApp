<?php
/** Import the approved named portraits into WordPress Media and update About cards once. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$_SERVER['HTTP_HOST'] = 'govisibi.ai';
$_SERVER['HTTPS'] = 'on';
require '/var/www/html/wp-load.php';
if ( get_option( 'visibi_team_photos_imported' ) === '1' ) { exit( "Team portraits already imported\n" ); }
if ( $GLOBALS['wpdb']->prefix !== 'v2_' || untrailingslashit( home_url() ) !== 'https://govisibi.ai' || get_option( 'visibi_root_promotion_version' ) !== '1' ) {
    fwrite( STDERR, "Refusing to update an unexpected WordPress installation\n" );
    exit( 1 );
}
$page = get_page_by_path( 'about' );
if ( ! $page || $page->post_status !== 'publish' ) { fwrite( STDERR, "Published About page missing\n" ); exit( 1 ); }
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
$names = array(
    'Adnan Khan', 'Saeed Ak', 'Omar Al Hashimi', 'Daniel Hughes', 'Priya Nair',
    'Thomas Reid', 'Hannah Clarke', 'Layla Haddad', 'Michael Turner',
    'Lukas Weber', 'Sophie Martin', 'Wei Ling Tan', 'Arjun Mehta'
);
$content = $page->post_content;
$asset_dir = is_dir( '/opt/visibi/theme/assets/team/' )
    ? '/opt/visibi/theme/assets/team/'
    : dirname( __DIR__ ) . '/wp-content/themes/visibi/assets/team/';
foreach ( $names as $index => $name ) {
    $slot = 'team-' . $index;
    $slot_pattern = '~<span class="visibi-media-slot" data-visibi-slot="' . preg_quote( $slot, '~' ) . '"[^>]*>[^<]*</span>~';
    $parent_pattern = '~<div style="position: absolute; inset: 0px; z-index: 0;">(?=<span class="visibi-media-slot" data-visibi-slot="' . preg_quote( $slot, '~' ) . '")~';
    if ( preg_match_all( $slot_pattern, $content ) !== 1 || preg_match_all( $parent_pattern, $content ) !== 1 ) {
        fwrite( STDERR, "About card structure changed: $slot\n" ); exit( 1 );
    }
}
if ( preg_match_all( '~<span class="visibi-media-slot" data-visibi-slot="about-team"[^>]*>[^<]*</span>~', $content ) !== 1 ) {
    fwrite( STDERR, "About team image slot changed\n" ); exit( 1 );
}
$updated = 0;
foreach ( $names as $index => $name ) {
    $slug = sanitize_title( $name );
    $slot = 'team-' . $index;
    $source = $asset_dir . $slug . '.png';
    if ( ! is_file( $source ) || ! is_readable( $source ) ) { fwrite( STDERR, "Portrait missing: $slug\n" ); exit( 1 ); }
    $existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_team_photo', 'meta_value' => $slug, 'posts_per_page' => 1, 'fields' => 'ids' ) );
    $attachment_id = $existing ? (int) $existing[0] : 0;
    if ( ! $attachment_id ) {
        $temporary = wp_tempnam( $slug . '.png' );
        if ( ! $temporary || ! copy( $source, $temporary ) ) { fwrite( STDERR, "Could not stage portrait: $slug\n" ); exit( 1 ); }
        $attachment_id = media_handle_sideload( array( 'name' => $slug . '.png', 'tmp_name' => $temporary ), $page->ID, $name );
        if ( is_wp_error( $attachment_id ) ) { @unlink( $temporary ); fwrite( STDERR, "Could not import portrait: $slug\n" ); exit( 1 ); }
        update_post_meta( $attachment_id, '_visibi_team_photo', $slug );
    }
    $image = wp_get_attachment_image( $attachment_id, 'medium_large', false, array(
        'alt' => $name, 'style' => 'display:block;width:100%;height:100%;object-fit:cover;object-position:center 28%'
    ) );
    if ( ! $image ) { fwrite( STDERR, "Imported portrait cannot be rendered: $slug\n" ); exit( 1 ); }
    $parent_pattern = '~(<div style="position: absolute; inset: 0px; z-index: )0(;">(?=<span class="visibi-media-slot" data-visibi-slot="' . preg_quote( $slot, '~' ) . '"))~';
    $content = preg_replace( $parent_pattern, '${1}2${2}', $content, 1, $parent_count );
    $slot_pattern = '~<span class="visibi-media-slot" data-visibi-slot="' . preg_quote( $slot, '~' ) . '"[^>]*>[^<]*</span>~';
    $content = preg_replace( $slot_pattern, $image, $content, 1, $slot_count );
    if ( $parent_count !== 1 || $slot_count !== 1 ) { fwrite( STDERR, "About card structure changed: $slot\n" ); exit( 1 ); }
    ++$updated;
}
if ( $updated !== count( $names ) ) { fwrite( STDERR, "Expected 13 portrait slots, found $updated\n" ); exit( 1 ); }
$team_source = $asset_dir . 'teams-image.png';
if ( ! is_readable( $team_source ) ) { fwrite( STDERR, "Team group photo missing\n" ); exit( 1 ); }
$group_photo = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_visibi_team_photo', 'meta_value' => 'teams-image', 'posts_per_page' => 1, 'fields' => 'ids' ) );
$group_id = $group_photo ? (int) $group_photo[0] : 0;
if ( ! $group_id ) {
    $temporary = wp_tempnam( 'teams-image.png' );
    if ( ! $temporary || ! copy( $team_source, $temporary ) ) { fwrite( STDERR, "Could not stage team group photo\n" ); exit( 1 ); }
    $group_id = media_handle_sideload( array( 'name' => 'teams-image.png', 'tmp_name' => $temporary ), $page->ID, 'VISIBI team' );
    if ( is_wp_error( $group_id ) ) { @unlink( $temporary ); fwrite( STDERR, "Could not import team group photo\n" ); exit( 1 ); }
    update_post_meta( $group_id, '_visibi_team_photo', 'teams-image' );
}
$group_image = wp_get_attachment_image( $group_id, 'large', false, array(
    'alt' => 'The VISIBI team together', 'style' => 'display:block;width:100%;height:100%;object-fit:cover;object-position:center 42%'
) );
$content = preg_replace( '~<span class="visibi-media-slot" data-visibi-slot="about-team"[^>]*>[^<]*</span>~', $group_image, $content, 1, $group_count );
if ( $group_count !== 1 ) { fwrite( STDERR, "About team image slot changed\n" ); exit( 1 ); }
$result = wp_update_post( array( 'ID' => $page->ID, 'post_content' => $content ), true );
if ( is_wp_error( $result ) ) { fwrite( STDERR, "Could not update About page\n" ); exit( 1 ); }
update_option( 'visibi_team_photos_imported', '1' );
echo "Imported and published $updated team portraits and the group photo\n";
