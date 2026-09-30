<?php
/** Focused dry run of the importer transform without WordPress or database writes. */
$source = file_get_contents( __DIR__ . '/import.php' );
$start = strpos( $source, 'function visibi_import_markup' );
$end = strpos( $source, '// Posts use' );
eval( substr( $source, $start, $end - $start ) );
$items = json_decode( file_get_contents( dirname( __DIR__ ) . '/content.json' ), true );
$count = 0;
$forms = 0;
$slots = 0;
$errors = array();
foreach ( $items as $item ) {
    $html = visibi_import_markup( $item['html'], $item['name'] );
    $count++;
    $forms += substr_count( $html, 'data-visibi-form="1"' );
    $slots += substr_count( $html, 'data-visibi-slot=' );
    if ( str_contains( $html, '<image-slot' ) ) { $errors[] = $item['name'] . ': unconverted image slot'; }
    if ( strlen( $html ) < 500 ) { $errors[] = $item['name'] . ': short transform'; }
    if ( 'Contact' === $item['name'] && ! str_contains( $html, 'data-visibi-form="1"' ) ) { $errors[] = 'Contact form missing'; }
}
echo json_encode( array( 'transformed' => $count, 'form_placeholders' => $forms, 'image_slots' => $slots, 'errors' => $errors ), JSON_PRETTY_PRINT ) . "\n";
exit( count( $errors ) ? 1 : 0 );
