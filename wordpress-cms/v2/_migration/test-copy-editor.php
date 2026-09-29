<?php
/** Pure copy-editor round trip. */
define( 'ABSPATH', __DIR__ );
function add_action() {}
function sanitize_textarea_field( $value ) { return strip_tags( $value ); }
require_once dirname( __DIR__ ) . '/wp-content/mu-plugins/visibi-copy-editor.php';
$source = file_get_contents( __DIR__ . '/import.php' );
$start = strpos( $source, 'function visibi_import_markup' );
$end = strpos( $source, '// Posts use' );
eval( substr( $source, $start, $end - $start ) );
$items = json_decode( file_get_contents( dirname( __DIR__ ) . '/content.json' ), true );
$home = null;
foreach ( $items as $item ) { if ( 'Home' === $item['name'] ) { $home = $item; break; } }
$content = visibi_import_markup( $home['html'], 'Home' );
$fields = array();
$same = visibi_copy_process( $content, array(), $fields );
if ( $same !== $content || count( $fields ) < 100 ) { exit( "Copy read failed\n" ); }
$changes = array( $fields[0]['key'] => 'Updated VISIBI copy' );
$updated_fields = array();
$changed = visibi_copy_process( $content, $changes, $updated_fields );
if ( ! str_contains( $changed, 'Updated VISIBI copy' ) || ! str_contains( $changed, '<!-- wp:html -->' ) ) { exit( "Copy save failed\n" ); }
echo json_encode( array( 'home_fragments' => count( $fields ), 'changed_bytes' => strlen( $changed ), 'result' => 'pass' ) ) . "\n";
