<?php
/** Local mail check; never prints credentials or addresses. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
require dirname( __DIR__ ) . '/wp-load.php';
if ( ! defined( 'WP_HOME' ) || WP_HOME !== 'http://localhost:8082/v2' ) { exit( "Wrong preview install\n" ); }
$failure = '';
add_action( 'phpmailer_init', function ( $mailer ) {
    echo 'Config: host=' . ( $mailer->Host === 'reymail.ukdns.biz' ? 'expected' : 'unexpected' ) . ', port=' . (int) $mailer->Port . ', auth=' . ( $mailer->SMTPAuth ? 'yes' : 'no' ) . ', secure=' . ( $mailer->SMTPSecure ? 'yes' : 'no' ) . "\n";
}, 99 );
add_action( 'wp_mail_failed', function ( $error ) use ( &$failure ) { $failure = $error->get_error_message(); } );
$sent = wp_mail( get_option( 'admin_email' ), 'VISIBI local SMTP test', 'Local SMTP configuration test.' );
if ( $sent ) { echo "SMTP accepted the test message.\n"; exit; }
if ( stripos( $failure, 'authenticat' ) !== false ) { echo "SMTP authentication failed.\n"; }
elseif ( stripos( $failure, 'connect' ) !== false ) { echo "SMTP connection failed.\n"; }
elseif ( stripos( $failure, 'recipient' ) !== false ) { echo "SMTP recipient rejected.\n"; }
else { echo "SMTP send failed; category unknown.\n"; }
$safe = str_replace( visibi_smtp_setting( 'PASSWORD' ), '[redacted]', $failure );
$safe = preg_replace( '/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', '[mailbox]', $safe );
echo substr( $safe, 0, 500 ) . "\n";
