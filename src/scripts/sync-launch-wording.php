<?php
/** Sync the approved promotional copy in WordPress's prefixed tables. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }

$dry_run = in_array( '--dry-run', $argv, true );
$site_url = rtrim( getenv( 'VISIBI_SITE_URL' ) ?: 'https://govisibi.ai', '/' );
$_SERVER['HTTP_HOST'] = (string) parse_url( $site_url, PHP_URL_HOST );
$_SERVER['HTTPS'] = str_starts_with( $site_url, 'https://' ) ? 'on' : 'off';
require '/var/www/html/wp-load.php';

global $wpdb;
if ( $wpdb->prefix !== 'v2_' ) {
    fwrite( STDERR, "Unexpected WordPress table prefix\n" );
    exit( 1 );
}
if ( ! $dry_run && ( untrailingslashit( home_url() ) !== 'https://govisibi.ai' || get_option( 'visibi_root_promotion_version' ) !== '1' ) ) {
    fwrite( STDERR, "Refusing to change an unexpected WordPress installation\n" );
    exit( 1 );
}

$marker = 'visibi_launch_copy_release_20261001';
if ( ! $dry_run && get_option( $marker ) === '1' ) {
    echo "Promotional copy already synced\n";
    exit( 0 );
}

$replacements = array(
    'Launch sale — plus an extra 20% off with code EXTRA20' => 'Limited-time offer — plus an extra 20% off with code EXTRA20',
    'Our launch prices are already 50% off' => 'Our prices are already 50% off',
    '50% launch offer + EXTRA20' => '50% off + EXTRA20',
    '7-day free trial · 50% launch offer' => '7-day free trial · 50% off',
    'Launch and promotional prices' => 'Sale and promotional prices',
    'Launch offer:' => 'Limited-time offer:',
    'Launch offer —' => 'Limited-time offer —',
    'LAUNCH OFFER' => 'LIMITED-TIME OFFER',
    'Launch offer' => 'Limited-time offer',
    'launch offer' => 'limited-time offer',
    'launch prices' => 'prices',
    'launch pricing' => 'sale pricing',
    'launch price' => 'sale price',
);

function visibi_sync_copy( $value, $replacements ) {
    if ( is_string( $value ) ) {
        return str_replace( array_keys( $replacements ), array_values( $replacements ), $value );
    }
    if ( is_array( $value ) ) {
        foreach ( $value as $key => $item ) {
            $value[ $key ] = visibi_sync_copy( $item, $replacements );
        }
    } elseif ( is_object( $value ) ) {
        foreach ( get_object_vars( $value ) as $key => $item ) {
            $value->$key = visibi_sync_copy( $item, $replacements );
        }
    }
    return $value;
}

$changed = array();
$tables = $wpdb->get_col( "SHOW TABLES LIKE 'v2\\_%'" );
foreach ( $tables as $table ) {
    if ( ! preg_match( '/^v2_[a-zA-Z0-9_]+$/', $table ) ) { continue; }
    $columns = $wpdb->get_results( "SHOW COLUMNS FROM `$table`", ARRAY_A );
    $keys = array();
    $text_columns = array();
    foreach ( $columns as $column ) {
        if ( $column['Key'] === 'PRI' ) { $keys[] = $column['Field']; }
        if ( preg_match( '/^(?:var)?char|^(?:tiny|medium|long)?text/i', $column['Type'] ) ) { $text_columns[] = $column['Field']; }
    }
    if ( ! $keys || ! $text_columns ) { continue; }
    $rows = $wpdb->get_results( "SELECT * FROM `$table`", ARRAY_A );
    foreach ( $rows as $row ) {
        $updates = array();
        foreach ( $text_columns as $column ) {
            $old = $row[ $column ];
            if ( ! is_string( $old ) || ! str_contains( strtolower( $old ), 'launch' ) ) { continue; }
            $was_serialized = is_serialized( $old );
            $value = $was_serialized ? maybe_unserialize( $old ) : $old;
            $new = visibi_sync_copy( $value, $replacements );
            $new = $was_serialized ? maybe_serialize( $new ) : $new;
            if ( $new !== $old ) { $updates[ $column ] = $new; }
        }
        if ( ! $updates ) { continue; }
        $where = array_intersect_key( $row, array_flip( $keys ) );
        if ( count( $where ) !== count( $keys ) ) {
            fwrite( STDERR, "Missing primary key in $table\n" );
            exit( 1 );
        }
        $changed[ $table ] = ( $changed[ $table ] ?? 0 ) + 1;
        if ( ! $dry_run && $wpdb->update( $table, $updates, $where ) === false ) {
            fwrite( STDERR, "Update failed in $table: {$wpdb->last_error}\n" );
            exit( 1 );
        }
    }
}
foreach ( $changed as $table => $count ) { echo "$table: $count rows\n"; }
if ( ! $changed ) { echo "No matching promotional copy remains\n"; }
if ( ! $dry_run ) {
    wp_cache_flush();
    update_option( $marker, '1', false );
}
