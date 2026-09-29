<?php
/**
 * Plugin Name: VISIBI SMTP
 * Description: Sends WordPress email through the configured authenticated SMTP account.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function visibi_smtp_setting( $name, $default = '' ) {
    $constant = 'VISIBI_SMTP_' . $name;
    if ( defined( $constant ) ) { return constant( $constant ); }
    $value = getenv( $constant );
    return false !== $value && '' !== $value ? $value : $default;
}

add_action( 'phpmailer_init', function ( $mailer ) {
    $password = visibi_smtp_setting( 'PASSWORD' );
    if ( ! $password ) { return; }
    $mailer->isSMTP();
    $mailer->Host = visibi_smtp_setting( 'HOST', 'reymail.ukdns.biz' );
    $mailer->Port = (int) visibi_smtp_setting( 'PORT', 465 );
    $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mailer->SMTPAuth = true;
    $mailer->Username = visibi_smtp_setting( 'USERNAME', 'info@govisibi.ai' );
    $mailer->Password = $password;
    $mailer->Timeout = 15;
}, 20 );

add_filter( 'wp_mail_from', function ( $from ) {
    return visibi_smtp_setting( 'PASSWORD' ) ? visibi_smtp_setting( 'USERNAME', 'info@govisibi.ai' ) : $from;
} );
add_filter( 'wp_mail_from_name', function ( $name ) {
    return visibi_smtp_setting( 'PASSWORD' ) ? 'VISIBI' : $name;
} );
