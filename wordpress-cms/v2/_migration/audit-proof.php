<?php
$items = json_decode( file_get_contents( dirname( __DIR__ ) . '/content.json' ), true );
$labels = array();
foreach ( $items as $item ) {
    if ( ! str_contains( $item['html'], '<image-slot' ) ) { continue; }
    $doc = new DOMDocument( '1.0', 'UTF-8' );
    libxml_use_internal_errors( true );
    $doc->loadHTML( '<?xml encoding="UTF-8"><div>' . $item['html'] . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
    libxml_clear_errors();
    $xpath = new DOMXPath( $doc );
    foreach ( $xpath->query( '//image-slot' ) as $slot ) {
        $label = 'No section label';
        for ( $p = $slot->parentNode; $p; $p = $p->parentNode ) {
            if ( $p instanceof DOMElement && $p->hasAttribute( 'data-screen-label' ) ) { $label = $p->getAttribute( 'data-screen-label' ); break; }
        }
        $labels[ $label ] = ( $labels[ $label ] ?? 0 ) + 1;
    }
}
arsort( $labels );
echo json_encode( $labels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ) . "\n";
