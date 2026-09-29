<?php
/** Verify the local form tests reached editable WordPress records. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
require dirname( __DIR__ ) . '/wp-load.php';
$leads = get_posts( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'numberposts' => 100 ) );
$all = implode( "\n", array_map( function ( $post ) { return $post->post_content; }, $leads ) );
$career = null;
foreach ( $leads as $lead ) {
    if ( str_starts_with( $lead->post_title, 'Application: General application' ) ) { $career = $lead; break; }
}
$subscribers = get_posts( array( 'post_type' => 'visibi_subscriber', 'post_status' => 'private', 'numberposts' => 10 ) );
$checks = array(
    'schemeless website stored as HTTPS' => str_contains( $all, 'Website: https://example.com' ),
    'HTTP website retained' => str_contains( $all, 'Website: http://example.com' ),
    'meeting details saved' => str_contains( $all, 'Preferred time: 09:00 (UK time)' ),
    'invoice request saved without claiming payment' => str_contains( $all, 'Invoice: VIS-2026-0142' ) && str_contains( $all, 'Payment has not been taken.' ),
    'CV saved privately with enquiry' => $career && get_post_meta( $career->ID, '_visibi_cv_data', true ) && get_post_meta( $career->ID, '_visibi_cv_name', true ) === 'preview-test-cv.pdf',
    'newsletter subscriber saved' => (bool) array_filter( $subscribers, function ( $post ) { return str_starts_with( $post->post_title, 'newsletter-' ); } ),
);
foreach ( $checks as $label => $ok ) {
    echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
    if ( ! $ok ) { $failed = true; }
}
if ( ! empty( $failed ) ) { exit( 1 ); }
