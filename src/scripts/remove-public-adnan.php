<?php
/** Remove retired public profile and reviewer credits without filtering the page HTML. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$dry_run = in_array( '--dry-run', $argv, true );
$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

global $wpdb;
if ( $wpdb->prefix !== 'v2_' || untrailingslashit( home_url() ) !== $site_url ) {
    fwrite( STDERR, "Refusing to change an unexpected WordPress installation\n" );
    exit( 1 );
}
$marker = 'visibi_public_profile_cleanup_20261005';
if ( get_option( $marker ) === '1' ) { echo "Public profile removal already applied\n"; exit( 0 ); }
$about = get_page_by_path( 'about' );
if ( ! $about || $about->post_status !== 'publish' ) { fwrite( STDERR, "Published About page missing\n" ); exit( 1 ); }
$continuing = ! str_contains( $about->post_content, 'Adnan Khan' )
    && str_contains( $about->post_content, 'team-group-2026.png' );

$updates = array();
$published = $wpdb->get_results( "SELECT ID, post_type, post_name, post_content FROM {$wpdb->posts} WHERE post_status = 'publish' AND post_content LIKE '%Adnan%'" );
$article_count = 0;
foreach ( $published as $post ) {
    $before = $post->post_content;
    $after = $before;
    if ( $post->post_type === 'page' && $post->post_name === 'about' ) {
        $old_photo = '/wp-content/uploads/2026/09/teams-image-1024x768.png';
        $new_photo = '/wp-content/themes/visibi/assets/team/team-group-2026.png';
        $card = '      <div style="border: 1px solid rgb(227, 232, 242); border-radius: 22px; overflow: hidden; display: flex; flex-direction: column;">';
        $team = strpos( $after, '<section id="team"' );
        $first = false === $team ? false : strpos( $after, $card, $team );
        $second = false === $first ? false : strpos( $after, $card, $first + strlen( $card ) );
        if ( substr_count( $after, $old_photo ) !== 1 || false === $second
            || ! str_contains( substr( $after, $first, $second - $first ), 'Adnan Khan' ) ) {
            fwrite( STDERR, "Unexpected About card or group image\n" ); exit( 1 );
        }
        $after = substr_replace( $after, '', $first, $second - $first );
        $after = str_replace( $old_photo, $new_photo, $after );
    } elseif ( $post->post_type === 'page' && $post->post_name === 'careers' ) {
        $replacements = array(
            'Founded by Adnan Khan and Saeed Ak, with 25 years each building and scaling digital businesses. You’ll work directly with the founders' => 'Led by Saeed Ak, with 25 years building and scaling digital businesses. You’ll work directly with the senior team',
            'Meet the founders' => 'Meet the leadership team',
            'Final chat with Adnan or Saeed Ak, then an offer.' => 'Final chat with Saeed Ak, then an offer.',
        );
        foreach ( $replacements as $old => $new ) {
            if ( substr_count( $after, $old ) !== 1 ) { fwrite( STDERR, "Unexpected Careers copy\n" ); exit( 1 ); }
            $after = str_replace( $old, $new, $after );
        }
    } elseif ( $post->post_type === 'page' && in_array( $post->post_name, array( 'guard', 'radar' ), true ) ) {
        $old = 'VISIBI — founded by Adnan Khan &amp; Saeed Ak, with teams across the UK and UAE.';
        if ( substr_count( $after, $old ) !== 1 ) { fwrite( STDERR, "Unexpected {$post->post_name} copy\n" ); exit( 1 ); }
        $after = str_replace( $old, 'VISIBI — led by Saeed Ak, with teams across the UK and UAE.', $after );
    } elseif ( $post->post_type === 'post' ) {
        $header = '<span>·</span><span>Reviewed by <span>Adnan Khan</span>, <span>Co-founder &amp; CEO</span></span>';
        if ( substr_count( $after, $header ) !== 1 ) { fwrite( STDERR, "Unexpected article header {$post->ID}\n" ); exit( 1 ); }
        $after = str_replace( $header, '', $after );
        $reviewer = '~\s*<div style="display: flex; gap: 16px; align-items: center; border-top: 1px solid rgb\(227, 232, 242\); padding-top: 24px;">\s*<span[^>]*><span>AK</span></span>\s*<div[^>]*>\s*<span[^>]*>Reviewed by <span>Adnan Khan</span>.*?</div>\s*</div>~s';
        $after = preg_replace( $reviewer, '', $after, 1, $count );
        if ( $count !== 1 ) { fwrite( STDERR, "Unexpected article reviewer card {$post->ID}\n" ); exit( 1 ); }
        ++$article_count;
    } else {
        fwrite( STDERR, "Unexpected public mention on {$post->post_type} {$post->ID}\n" ); exit( 1 );
    }
    if ( stripos( $after, 'adnan' ) !== false ) { fwrite( STDERR, "Mention remains on {$post->ID}\n" ); exit( 1 ); }
    $updates[ $post->ID ] = $after;
}
if ( ! $continuing && ( count( $updates ) < 40 || $article_count < 35 ) ) {
    fwrite( STDERR, "Expected public pages and articles are missing\n" ); exit( 1 );
}

$photos = array();
foreach ( array( 'adnan-khan', 'teams-image' ) as $slug ) {
    $ids = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit',
        'meta_key' => '_visibi_team_photo', 'meta_value' => $slug, 'posts_per_page' => 5, 'fields' => 'ids' ) );
    if ( count( $ids ) > 1 || ( ! $continuing && count( $ids ) !== 1 ) ) {
        fwrite( STDERR, "Expected Media Library image missing or duplicated: $slug\n" ); exit( 1 );
    }
    if ( $ids ) { $photos[ $slug ] = (int) $ids[0]; }
}

echo 'Public records to update: ' . count( $updates ) . " ($article_count articles)\n";
foreach ( array_keys( $updates ) as $id ) { echo "POST $id\n"; }
echo 'Media Library images to remove: ' . implode( ', ', array_keys( $photos ) ) . "\n";
if ( $dry_run ) { exit( 0 ); }

$wpdb->query( 'START TRANSACTION' );
foreach ( $updates as $id => $content ) {
    if ( $wpdb->update( $wpdb->posts, array( 'post_content' => $content ), array( 'ID' => $id ), array( '%s' ), array( '%d' ) ) !== 1 ) {
        $wpdb->query( 'ROLLBACK' ); fwrite( STDERR, "Could not update public record $id\n" ); exit( 1 );
    }
}
$wpdb->query( 'COMMIT' );
foreach ( array_keys( $updates ) as $id ) { clean_post_cache( $id ); }
require_once ABSPATH . 'wp-admin/includes/post.php';
foreach ( $photos as $slug => $id ) {
    if ( ! wp_delete_attachment( $id, true ) ) { fwrite( STDERR, "Could not remove Media Library image $slug\n" ); exit( 1 ); }
}
$wpdb->delete( $wpdb->options, array( 'option_name' => '_transient_yoast_beacon_session_data' ) );
$wpdb->delete( $wpdb->postmeta, array( 'post_id' => (int) get_page_by_path( 'about' )->ID, 'meta_key' => '_visibi_local_pre_canonical_20261001' ) );
if ( $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}yoast_seo_links'" ) ) {
    $wpdb->query( "DELETE FROM {$wpdb->prefix}yoast_seo_links WHERE url LIKE '%adnan%' OR url LIKE '%teams-image%'" );
}
if ( $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}yoast_indexable'" ) ) {
    $about_id = (int) get_page_by_path( 'about' )->ID;
    $wpdb->delete( $wpdb->prefix . 'yoast_indexable', array( 'object_id' => $about_id, 'object_type' => 'post' ) );
}
foreach ( $wpdb->get_col( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'revision' AND post_content LIKE '%Adnan%'" ) as $id ) {
    wp_delete_post( (int) $id, true );
}
wp_cache_flush();
update_option( $marker, '1', false );
echo "Public mentions and old media removed\n";
