<?php
/** Link the private local SMTP secret file into wp-config.php. No secret is stored here. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$root = dirname( __DIR__ );
$config = $root . '/wp-config.php';
$secret = $root . '/.visibi-smtp.php';
if ( ! is_file( $config ) || ! is_file( $secret ) ) { exit( "Local SMTP files missing\n" ); }
$source = file_get_contents( $config );
$private = file_get_contents( $secret );
if ( strpos( $private, 'VISIBI_SMTP_PORT' ) === false ) {
    file_put_contents( $secret, "\ndefine( 'VISIBI_SMTP_PORT', 465 );\n", FILE_APPEND );
}
$line = "if ( file_exists( __DIR__ . '/.visibi-smtp.php' ) ) { require __DIR__ . '/.visibi-smtp.php'; }\n";
$needle = "require_once ABSPATH . 'wp-settings.php';";
if ( strpos( $source, $line ) === false ) {
    if ( strpos( $source, $needle ) === false ) { exit( "Config insertion point missing\n" ); }
    $source = str_replace( $needle, $line . $needle, $source );
    file_put_contents( $config, $source );
}
echo "Private SMTP config linked.\n";
