<?php
/**
 * Plugin Name: VISIBI Content URLs
 * Description: Resolves imported content links and preserves page-level robots settings.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'wp_robots', function ( $robots ) {
    if ( is_singular() ) {
        $rule = get_post_meta( get_queried_object_id(), '_visibi_robots', true );
        if ( $rule && strpos( $rule, 'noindex' ) !== false ) { unset( $robots['index'] ); $robots['noindex'] = true; }
        if ( $rule && strpos( $rule, 'nofollow' ) !== false ) { unset( $robots['follow'] ); $robots['nofollow'] = true; }
    }
    return $robots;
}, 101 );

add_filter( 'the_content', function ( $content ) {
    $content = str_replace( '%%VISIBI_THEME_URI%%', esc_url( get_template_directory_uri() ), $content );
    $content = preg_replace_callback( '/\b(href|action)="\/(?!\/)([^"#]*)"/', function ( $match ) {
        return $match[1] . '="' . esc_url( home_url( '/' . $match[2] ) ) . '"';
    }, $content );
    return $content;
}, 11 );

add_action( 'wp_footer', function () {
    ?>
    <script>
    window.addEventListener('click', function(event) {
      var button = event.target.closest && event.target.closest('[data-visibi-static-action]');
      if (!button) return;
      event.preventDefault(); event.stopImmediatePropagation();
      window.location.href = <?php echo wp_json_encode( home_url( '/contact/#form' ) ); ?>;
    }, true);
    </script>
    <?php
}, 99 );
