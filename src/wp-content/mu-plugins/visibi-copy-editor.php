<?php
/**
 * Plugin Name: VISIBI Copy Editor
 * Description: Edit text in imported VISIBI sections without editing their HTML layout.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function visibi_copy_process( $content, $changes, &$fields ) {
    $block_number = 0;
    return preg_replace_callback( '/<!-- wp:html -->\s*(.*?)\s*<!-- \/wp:html -->/s', function ( $match ) use ( $changes, &$fields, &$block_number ) {
        $block_number++;
        $doc = new DOMDocument( '1.0', 'UTF-8' );
        libxml_use_internal_errors( true );
        $doc->loadHTML( '<?xml encoding="UTF-8"><div id="visibi-copy-root">' . $match[1] . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        libxml_clear_errors();
        $xpath = new DOMXPath( $doc );
        $root = $xpath->query( '//*[@id="visibi-copy-root"]' )->item( 0 );
        if ( ! $root ) { return $match[0]; }
        $text_nodes = $xpath->query( './/text()[normalize-space(.) != "" and not(ancestor::script) and not(ancestor::style) and not(ancestor::svg)]', $root );
        $text_number = 0;
        $modified = false;
        foreach ( $text_nodes as $node ) {
            $text_number++;
            $key = $block_number . ':' . $text_number;
            $original = trim( $node->nodeValue );
            if ( isset( $changes[ $key ] ) && is_string( $changes[ $key ] ) ) {
                $new = sanitize_textarea_field( $changes[ $key ] );
                if ( $new !== $original ) {
                    preg_match( '/^\s*/u', $node->nodeValue, $leading );
                    preg_match( '/\s*$/u', $node->nodeValue, $trailing );
                    $node->nodeValue = $leading[0] . $new . $trailing[0];
                    $modified = true;
                }
            }
            $section = 'Section ' . $block_number;
            for ( $parent = $node->parentNode; $parent && $parent !== $root; $parent = $parent->parentNode ) {
                if ( $parent instanceof DOMElement && $parent->hasAttribute( 'data-screen-label' ) ) { $section = $parent->getAttribute( 'data-screen-label' ); break; }
            }
            $fields[] = array( 'key' => $key, 'value' => trim( $node->nodeValue ), 'section' => $section, 'tag' => $node->parentNode->nodeName );
        }
        if ( ! $modified ) { return $match[0]; }
        $html = '';
        foreach ( $root->childNodes as $child ) { $html .= $doc->saveHTML( $child ); }
        return '<!-- wp:html -->' . "\n" . trim( $html ) . "\n" . '<!-- /wp:html -->';
    }, $content );
}

add_action( 'admin_menu', function () {
    add_menu_page( 'VISIBI Copy', 'VISIBI Copy', 'edit_pages', 'visibi-copy', 'visibi_copy_admin', 'dashicons-edit-page', 25 );
} );

function visibi_copy_admin() {
    if ( ! current_user_can( 'edit_pages' ) ) { wp_die( 'Access denied.' ); }
    $id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
    echo '<div class="wrap"><h1>VISIBI Copy Editor</h1><p>Edit words here without changing the page layout. Use the normal Page/Post editor for layout and media changes.</p>';
    if ( ! $id ) {
        $posts = get_posts( array( 'post_type' => array( 'page', 'post' ), 'post_status' => array( 'publish', 'draft' ), 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
        echo '<div style="columns:3;max-width:1200px">';
        foreach ( $posts as $post ) {
            if ( ! current_user_can( 'edit_post', $post->ID ) ) { continue; }
            echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=visibi-copy&post=' . $post->ID ) ) . '">' . esc_html( $post->post_title ) . '</a></p>';
        }
        echo '</div></div>';
        return;
    }
    $post = get_post( $id );
    if ( ! $post || ! current_user_can( 'edit_post', $id ) ) { wp_die( 'Page not found.' ); }
    $fields = array();
    visibi_copy_process( $post->post_content, array(), $fields );
    echo '<h2>' . esc_html( $post->post_title ) . '</h2><p>' . count( $fields ) . ' text fragments</p>';
    echo '<form id="visibi-copy-form" method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
    echo '<input type="hidden" name="action" value="visibi_copy_save"><input type="hidden" name="post_id" value="' . esc_attr( $id ) . '">';
    echo '<textarea name="visibi_copy_json" id="visibi-copy-json" hidden></textarea>';
    wp_nonce_field( 'visibi_copy_save_' . $id );
    $section = '';
    foreach ( $fields as $field ) {
        if ( $field['section'] !== $section ) {
            $section = $field['section'];
            echo '<h3 style="margin:25px 0 10px;border-bottom:1px solid #ccd0d4;padding-bottom:8px">' . esc_html( $section ) . '</h3>';
        }
        $label = strtoupper( $field['tag'] ) . ' · ' . wp_html_excerpt( $field['value'], 75, '…' );
        echo '<label style="display:block;max-width:900px;margin-bottom:12px"><span style="display:block;font-size:12px;color:#50575e;margin-bottom:4px">' . esc_html( $label ) . '</span>';
        echo '<textarea data-visibi-key="' . esc_attr( $field['key'] ) . '" rows="' . ( strlen( $field['value'] ) > 110 ? '3' : '1' ) . '" style="width:100%">' . esc_textarea( $field['value'] ) . '</textarea></label>';
    }
    echo '<p class="submit"><button class="button button-primary" type="submit">Save copy</button> <a class="button" href="' . esc_url( get_permalink( $id ) ) . '" target="_blank" rel="noopener">View page</a></p></form>';
    echo '<script>document.getElementById("visibi-copy-form").addEventListener("submit",function(){var values={};this.querySelectorAll("[data-visibi-key]").forEach(function(el){values[el.dataset.visibiKey]=el.value});document.getElementById("visibi-copy-json").value=JSON.stringify(values)});</script></div>';
}

add_action( 'admin_post_visibi_copy_save', function () {
    $id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
    if ( ! $id || ! current_user_can( 'edit_post', $id ) ) { wp_die( 'Access denied.' ); }
    check_admin_referer( 'visibi_copy_save_' . $id );
    $raw = isset( $_POST['visibi_copy_json'] ) ? wp_unslash( $_POST['visibi_copy_json'] ) : '{}';
    $changes = json_decode( $raw, true );
    if ( ! is_array( $changes ) ) { wp_die( 'Invalid form data.' ); }
    $post = get_post( $id );
    $fields = array();
    $content = visibi_copy_process( $post->post_content, $changes, $fields );
    $result = wp_update_post( wp_slash( array( 'ID' => $id, 'post_content' => $content ) ), true );
    if ( is_wp_error( $result ) ) { wp_die( esc_html( $result->get_error_message() ) ); }
    wp_safe_redirect( admin_url( 'admin.php?page=visibi-copy&post=' . $id . '&saved=1' ) );
    exit;
} );
