<?php
/** Validate that PHP DOM can parse all exported pages before a WordPress database exists. */
$items = json_decode( file_get_contents( dirname( __DIR__ ) . '/content.json' ), true );
$errors = array();
$audit_forms = 0;
foreach ( $items as $item ) {
    $doc = new DOMDocument( '1.0', 'UTF-8' );
    libxml_use_internal_errors( true );
    $ok = $doc->loadHTML( '<?xml encoding="UTF-8"><div id="visibi-import-root">' . $item['html'] . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
    libxml_clear_errors();
    $xpath = new DOMXPath( $doc );
    if ( ! $ok || ! $xpath->query( '//*[@id="visibi-import-root"]' )->length ) { $errors[] = $item['name'] . ': DOM parse failed'; continue; }
    if ( 1 !== $xpath->query( '//*[@id="visibi-import-root"]//h1' )->length ) { $errors[] = $item['name'] . ': expected one H1'; }
    if ( $xpath->query( '//*[@id="audit"]//input' )->length >= 2 ) { $audit_forms++; }
}
echo json_encode( array( 'checked' => count( $items ), 'audit_panels_with_inputs' => $audit_forms, 'errors' => $errors ), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . "\n";
exit( count( $errors ) ? 1 : 0 );
