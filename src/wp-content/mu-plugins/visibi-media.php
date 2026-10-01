<?php
/**
 * Plugin Name: VISIBI Media Slots
 * Description: Fill design image positions from the WordPress Media Library.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'the_content', function ( $content ) {
    if ( ! is_singular() || strpos( $content, 'data-visibi-slot=' ) === false ) { return $content; }
    $example_page = is_page( array( 'radar', 'guard' ) );
    if ( $example_page ) {
        $content = str_replace( array( 'TRUSTED BY MARKETING TEAMS AT', 'TRUSTED BY ECOMMERCE TEAMS AT' ), array( 'BUILT FOR MARKETING TEAMS', 'BUILT FOR ECOMMERCE TEAMS' ), $content );
    }
    $slots = get_post_meta( get_queried_object_id(), '_visibi_media_slots', true );
    if ( ! is_array( $slots ) ) {
        if ( ! $example_page ) { return $content; }
        $slots = array();
    }
    return preg_replace_callback( '/(<span\b[^>]*class="visibi-media-slot"[^>]*data-visibi-slot="([^"]+)"[^>]*>).*?<\/span>/s', function ( $match ) use ( $slots, $example_page ) {
        $id = $match[2];
        $attachment = isset( $slots[ $id ] ) ? absint( $slots[ $id ] ) : 0;
        if ( ! $attachment || ! wp_attachment_is_image( $attachment ) ) {
            if ( $example_page && preg_match( '/^(?:radar|guard)-logo-([1-6])$/', $id, $logo_match ) ) {
                $image_url = get_stylesheet_directory_uri() . '/assets/sample-brand-marks/mark-' . $logo_match[1] . '.svg';
                $image = '<img src="' . esc_url( $image_url ) . '" class="visibi-slot-image" alt="" aria-hidden="true" loading="lazy" decoding="async" width="140" height="60">';
                return str_replace( 'class="visibi-media-slot"', 'class="visibi-media-slot is-filled"', $match[1] ) . $image . '</span>';
            }
            return $match[0];
        }
        $alt = get_post_meta( $attachment, '_wp_attachment_image_alt', true );
        if ( ! $alt && preg_match( '/data-visibi-alt="([^"]*)"/', $match[1], $alt_match ) ) { $alt = html_entity_decode( $alt_match[1], ENT_QUOTES, 'UTF-8' ); }
        $image = wp_get_attachment_image( $attachment, 'large', false, array( 'class' => 'visibi-slot-image', 'alt' => $alt, 'loading' => 'lazy', 'decoding' => 'async' ) );
        return str_replace( 'class="visibi-media-slot"', 'class="visibi-media-slot is-filled"', $match[1] ) . $image . '</span>';
    }, $content );
}, 18 );

add_action( 'admin_menu', function () {
    add_submenu_page( 'visibi-copy', 'VISIBI Images', 'VISIBI Images', 'edit_pages', 'visibi-images', 'visibi_media_admin' );
}, 20 );

function visibi_media_admin() {
    if ( ! current_user_can( 'edit_pages' ) ) { wp_die( 'Access denied.' ); }
    $id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
    echo '<div class="wrap"><h1>VISIBI Images</h1><p>Choose final photos, screenshots and proof assets from the Media Library. Add descriptive alt text in Media Library after choosing each image.</p>';
    if ( ! $id ) {
        $posts = get_posts( array( 'post_type' => array( 'page', 'post' ), 'post_status' => array( 'publish', 'draft' ), 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
        foreach ( $posts as $post ) {
            if ( strpos( $post->post_content, 'data-visibi-slot=' ) !== false && current_user_can( 'edit_post', $post->ID ) ) {
                preg_match_all( '/data-visibi-slot="([^"]+)"/', $post->post_content, $matches );
                echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=visibi-images&post=' . $post->ID ) ) . '">' . esc_html( $post->post_title ) . '</a> — ' . count( $matches[1] ) . ' image positions</p>';
            }
        }
        echo '</div>';
        return;
    }
    $post = get_post( $id );
    if ( ! $post || ! current_user_can( 'edit_post', $id ) ) { wp_die( 'Page not found.' ); }
    preg_match_all( '/data-visibi-slot="([^"]+)"/', $post->post_content, $matches );
    $slots = array_unique( $matches[1] );
    $chosen = get_post_meta( $id, '_visibi_media_slots', true );
    if ( ! is_array( $chosen ) ) { $chosen = array(); }
    wp_enqueue_media();
    echo '<h2>' . esc_html( $post->post_title ) . '</h2><form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
    echo '<input type="hidden" name="action" value="visibi_media_save"><input type="hidden" name="post_id" value="' . esc_attr( $id ) . '">';
    wp_nonce_field( 'visibi_media_save_' . $id );
    echo '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;max-width:1100px">';
    foreach ( $slots as $slot ) {
        $attachment = isset( $chosen[ $slot ] ) ? absint( $chosen[ $slot ] ) : 0;
        $src = $attachment ? wp_get_attachment_image_url( $attachment, 'medium' ) : '';
        echo '<div style="background:white;border:1px solid #ccd0d4;border-radius:10px;padding:14px"><strong>' . esc_html( $slot ) . '</strong><div style="height:140px;display:grid;place-items:center;background:#eef2fa;margin:10px 0;overflow:hidden"><img data-visibi-preview="' . esc_attr( $slot ) . '" src="' . esc_url( $src ?: '' ) . '" style="max-width:100%;max-height:100%;' . ( $src ? '' : 'display:none;' ) . '"></div>';
        echo '<input type="hidden" name="slots[' . esc_attr( $slot ) . ']" value="' . esc_attr( $attachment ) . '" data-visibi-input="' . esc_attr( $slot ) . '">';
        echo '<button type="button" class="button" data-visibi-choose="' . esc_attr( $slot ) . '">Choose image</button> <button type="button" class="button-link" data-visibi-clear="' . esc_attr( $slot ) . '">Clear</button></div>';
    }
    echo '</div><p class="submit"><button class="button button-primary" type="submit">Save images</button></p></form>';
    ?>
    <script>
    document.querySelectorAll('[data-visibi-choose]').forEach(function(button){button.addEventListener('click',function(){var key=this.dataset.visibiChoose;var frame=wp.media({title:'Choose image',button:{text:'Use image'},multiple:false});frame.on('select',function(){var file=frame.state().get('selection').first().toJSON();document.querySelector('[data-visibi-input="'+key+'"]').value=file.id;var img=document.querySelector('[data-visibi-preview="'+key+'"]');img.src=file.sizes&&file.sizes.medium?file.sizes.medium.url:file.url;img.style.display='block'});frame.open()})});
    document.querySelectorAll('[data-visibi-clear]').forEach(function(button){button.addEventListener('click',function(){var key=this.dataset.visibiClear;document.querySelector('[data-visibi-input="'+key+'"]').value='';document.querySelector('[data-visibi-preview="'+key+'"]')?.style.setProperty('display','none')})});
    </script></div>
    <?php
}

add_action( 'admin_post_visibi_media_save', function () {
    $id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
    if ( ! $id || ! current_user_can( 'edit_post', $id ) ) { wp_die( 'Access denied.' ); }
    check_admin_referer( 'visibi_media_save_' . $id );
    $post = get_post( $id );
    preg_match_all( '/data-visibi-slot="([^"]+)"/', $post->post_content, $matches );
    $allowed = array_fill_keys( $matches[1], true );
    $submitted = isset( $_POST['slots'] ) && is_array( $_POST['slots'] ) ? wp_unslash( $_POST['slots'] ) : array();
    $saved = array();
    foreach ( $submitted as $key => $value ) {
        if ( ! isset( $allowed[ $key ] ) ) { continue; }
        $attachment = absint( $value );
        if ( $attachment && wp_attachment_is_image( $attachment ) ) { $saved[ $key ] = $attachment; }
    }
    update_post_meta( $id, '_visibi_media_slots', $saved );
    wp_safe_redirect( admin_url( 'admin.php?page=visibi-images&post=' . $id . '&saved=1' ) );
    exit;
} );
