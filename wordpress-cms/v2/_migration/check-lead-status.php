<?php
/** Summarise recent preview enquiry notification states without disclosing personal data. */
if ( PHP_SAPI !== 'cli' ) { exit; }
require dirname( __DIR__ ) . '/wp-load.php';
$leads = get_posts( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'numberposts' => 3 ) );
foreach ( $leads as $lead ) {
    echo $lead->ID . ':' . get_post_meta( $lead->ID, '_visibi_email_status', true ) . PHP_EOL;
}
