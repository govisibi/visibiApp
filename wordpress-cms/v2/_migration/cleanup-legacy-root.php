<?php
/** Remove only the backed-up legacy root tables after the approved v2_ site is live. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$_SERVER['HTTP_HOST'] = 'govisibi.ai';
$_SERVER['HTTPS'] = 'on';
require '/var/www/html/wp-load.php';
global $wpdb;
$legacy_prefix = getenv( 'WORDPRESS_TABLE_PREFIX' ) ?: 'wp_';
if ( $legacy_prefix !== 'wp_' || $wpdb->prefix !== 'v2_' ||
    untrailingslashit( home_url() ) !== 'https://govisibi.ai' ||
    get_option( 'visibi_root_promotion_version' ) !== '1' ||
    get_option( 'visibi_team_photos_imported' ) !== '1' ||
    get_option( 'stylesheet' ) !== 'visibi' ||
    get_option( 'home' ) !== 'https://govisibi.ai' ||
    get_option( 'siteurl' ) !== 'https://govisibi.ai' ||
    ! is_blog_installed() || ! get_page_by_path( 'about' ) ) {
    fwrite( STDERR, "Refusing legacy cleanup: promoted WordPress validation failed\n" );
    exit( 1 );
}
$expected = array(
    'wp_commentmeta', 'wp_comments', 'wp_links', 'wp_options', 'wp_postmeta',
    'wp_posts', 'wp_term_relationships', 'wp_term_taxonomy', 'wp_termmeta',
    'wp_terms', 'wp_usermeta', 'wp_users', 'wp_yoast_expiring_store',
    'wp_yoast_indexable', 'wp_yoast_indexable_hierarchy', 'wp_yoast_migrations',
    'wp_yoast_primary_term', 'wp_yoast_seo_links'
);
$all_tables = $wpdb->get_col( 'SHOW TABLES' );
if ( ! is_array( $all_tables ) || $wpdb->last_error ) {
    fwrite( STDERR, "Could not inspect database tables\n" );
    exit( 1 );
}
$legacy_tables = array_values( array_filter( $all_tables, static function ( $table ) {
    return str_starts_with( $table, 'wp_' );
} ) );
sort( $expected );
sort( $legacy_tables );
if ( ! $legacy_tables ) {
    update_option( 'visibi_legacy_cleanup_version', '1' );
    echo "Legacy root tables already absent\n";
    exit( 0 );
}
if ( $legacy_tables !== $expected ) {
    fwrite( STDERR, "Refusing legacy cleanup: unexpected wp_ table inventory\n" );
    exit( 1 );
}
$quoted_tables = array_map( static function ( $table ) { return '`' . $table . '`'; }, $legacy_tables );
if ( false === $wpdb->query( 'DROP TABLE ' . implode( ', ', $quoted_tables ) ) ) {
    fwrite( STDERR, "Could not drop legacy root tables\n" );
    exit( 1 );
}
update_option( 'visibi_legacy_cleanup_version', '1' );
echo 'Removed ' . count( $legacy_tables ) . " backed-up legacy root tables\n";
