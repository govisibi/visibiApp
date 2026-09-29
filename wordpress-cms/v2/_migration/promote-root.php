<?php
/** Promote the installed VISIBI preview to the domain root without copying users or posts. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$_SERVER['HTTP_HOST'] = 'govisibi.ai';
$_SERVER['HTTPS'] = 'on';
require '/var/www/html/wp-load.php';
global $wpdb;
if ( 'v2_' !== $wpdb->prefix || untrailingslashit( home_url() ) !== 'https://govisibi.ai' || ! is_blog_installed() ) {
    fwrite( STDERR, "Refusing to promote an unexpected WordPress installation\n" );
    exit( 1 );
}
if ( get_option( 'visibi_root_promotion_version' ) === '1' ) { exit( "Root promotion already complete\n" ); }

function visibi_replace_preview_url( $value, &$changed ) {
    if ( is_string( $value ) ) {
        $new = str_replace(
            array( 'https://govisibi.ai/v2', 'http://govisibi.ai/v2' ),
            array( 'https://govisibi.ai', 'https://govisibi.ai' ),
            $value
        );
        if ( $new !== $value ) { $changed = true; }
        return $new;
    }
    if ( is_array( $value ) ) {
        foreach ( $value as $key => $part ) { $value[ $key ] = visibi_replace_preview_url( $part, $changed ); }
    } elseif ( is_object( $value ) ) {
        foreach ( get_object_vars( $value ) as $key => $part ) { $value->$key = visibi_replace_preview_url( $part, $changed ); }
    }
    return $value;
}

$tables = $wpdb->get_col( "SHOW TABLES LIKE 'v2\\_%'" );
if ( ! is_array( $tables ) || count( $tables ) < 11 ) {
    fwrite( STDERR, "The preview tables are incomplete\n" );
    exit( 1 );
}
$updates = 0;
foreach ( $tables as $table ) {
    if ( ! preg_match( '/^v2_[A-Za-z0-9_]+$/', $table ) ) { continue; }
    $keys = $wpdb->get_col( "SHOW KEYS FROM `$table` WHERE Key_name = 'PRIMARY'", 4 );
    if ( count( $keys ) !== 1 || ! preg_match( '/^[A-Za-z0-9_]+$/', $keys[0] ) ) { continue; }
    $key = $keys[0];
    foreach ( $wpdb->get_results( "SHOW COLUMNS FROM `$table`" ) as $field ) {
        $column = $field->Field;
        if ( ! preg_match( '/^[A-Za-z0-9_]+$/', $column ) || ! preg_match( '/char|text|json/i', $field->Type ) || $column === 'guid' ) { continue; }
        $rows = $wpdb->get_results( $wpdb->prepare(
            "SELECT `$key`, `$column` FROM `$table` WHERE `$column` LIKE %s",
            '%govisibi.ai/v2%'
        ) );
        foreach ( $rows as $row ) {
            $raw = (string) $row->$column;
            $serialized = is_serialized( $raw );
            $value = $serialized ? maybe_unserialize( $raw ) : $raw;
            $changed = false;
            $value = visibi_replace_preview_url( $value, $changed );
            if ( ! $changed ) { continue; }
            $replacement = $serialized ? serialize( $value ) : $value;
            if ( false === $wpdb->update( $table, array( $column => $replacement ), array( $key => $row->$key ) ) ) {
                fwrite( STDERR, "Could not update `$table`.`$column`\n" );
                exit( 1 );
            }
            ++$updates;
        }
    }
}
foreach ( array( 'home' => 'https://govisibi.ai', 'siteurl' => 'https://govisibi.ai', 'blog_public' => '1' ) as $name => $value ) {
    if ( false === $wpdb->update( $wpdb->options, array( 'option_value' => $value ), array( 'option_name' => $name ) ) ) {
        fwrite( STDERR, "Could not update WordPress option $name\n" );
        exit( 1 );
    }
}
wp_cache_flush();
flush_rewrite_rules( false );
update_option( 'visibi_root_promotion_version', '1' );
echo "VISIBI root promotion complete; URL fields updated: $updates\n";
