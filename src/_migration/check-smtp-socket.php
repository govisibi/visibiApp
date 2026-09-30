<?php
$context = stream_context_create( array( 'ssl' => array( 'verify_peer' => true, 'verify_peer_name' => true ) ) );
$socket = @stream_socket_client( 'ssl://reymail.ukdns.biz:465', $code, $message, 8, STREAM_CLIENT_CONNECT, $context );
echo $socket ? "PHP TLS socket connected.\n" : "PHP TLS socket failed: $code $message\n";
if ( $socket ) { fclose( $socket ); }
