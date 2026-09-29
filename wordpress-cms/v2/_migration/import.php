<?php
/** One-time local/staging importer. Run: php _migration/import.php from a configured /v2 WordPress install. */
if ( PHP_SAPI !== 'cli' ) { exit( "CLI only\n" ); }
$root = dirname( __DIR__ );
if ( ! file_exists( $root . '/wp-load.php' ) ) { exit( "WordPress core is missing from /v2.\n" ); }
require_once $root . '/wp-load.php';
if ( ! class_exists( 'DOMDocument' ) ) { exit( "PHP DOM extension is required.\n" ); }
// Seed an editable WordPress Site Icon once; later choices in Site Identity take precedence.
if ( ! get_option( 'site_icon' ) ) {
    $favicon = $root . '/wp-content/themes/visibi/assets/favicon.png';
    if ( is_file( $favicon ) ) {
        require_once ABSPATH . 'wp-admin/includes/image.php';
        $upload = wp_upload_bits( 'visibi-site-icon.png', null, file_get_contents( $favicon ) );
        if ( empty( $upload['error'] ) ) {
            $icon_id = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => 'VISIBI site icon', 'post_status' => 'inherit' ), $upload['file'] );
            if ( ! is_wp_error( $icon_id ) ) {
                wp_update_attachment_metadata( $icon_id, wp_generate_attachment_metadata( $icon_id, $upload['file'] ) );
                update_option( 'site_icon', $icon_id );
            }
        }
    }
}
// The export is trusted local markup. WordPress KSES otherwise strips design-critical
// inline colours, backgrounds, gradients and layout styles from CLI imports.
if ( function_exists( 'kses_remove_filters' ) ) { kses_remove_filters(); }
$file = $root . '/content.json';
$items = json_decode( file_get_contents( $file ), true );
if ( ! is_array( $items ) || count( $items ) < 170 ) { exit( "Content export is incomplete.\n" ); }

function visibi_import_markup( $html, $name ) {
    $doc = new DOMDocument( '1.0', 'UTF-8' );
    libxml_use_internal_errors( true );
    $doc->loadHTML( '<?xml encoding="UTF-8"><div id="visibi-import-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
    libxml_clear_errors();
    $xpath = new DOMXPath( $doc );
    $root = $xpath->query( '//*[@id="visibi-import-root"]' )->item( 0 );
    if ( ! $root ) { return ''; }

    if ( 'Sitemap' === $name ) {
        $draft_links = array();
        foreach ( $xpath->query( './/a[@href]', $root ) as $link ) {
            if ( preg_match( '#/(careers|pay-invoice)/?$#', $link->getAttribute( 'href' ) ) ) { $draft_links[] = $link; }
        }
        foreach ( $draft_links as $link ) {
            $remove = strtolower( $link->parentNode->nodeName ) === 'li' ? $link->parentNode : $link;
            $remove->parentNode->removeChild( $remove );
        }
    }

    // Preserve the prototype's image positions as media slots editable in WordPress.
    $slots = array();
    foreach ( $xpath->query( './/image-slot', $root ) as $slot ) { $slots[] = $slot; }
    foreach ( $slots as $slot ) {
        $replacement = $doc->createElement( 'span', $slot->getAttribute( 'placeholder' ) ?: 'Add image' );
        $replacement->setAttribute( 'class', 'visibi-media-slot' );
        $replacement->setAttribute( 'data-visibi-slot', $slot->getAttribute( 'id' ) );
        $replacement->setAttribute( 'data-visibi-alt', $slot->getAttribute( 'placeholder' ) ?: 'VISIBI image' );
        if ( $slot->hasAttribute( 'style' ) ) { $replacement->setAttribute( 'style', $slot->getAttribute( 'style' ) ); }
        $slot->parentNode->replaceChild( $replacement, $slot );
    }

    // Replace the prototype's simulated contact form with a real WordPress form.
    if ( 'Contact' === $name ) {
        $form = $xpath->query( '//*[@id="form"]' )->item( 0 );
        if ( $form ) {
            while ( $form->firstChild ) { $form->removeChild( $form->firstChild ); }
            $form->appendChild( $doc->createElement( 'div' ) )->setAttribute( 'data-visibi-form', '1' );
        }
    } else {
        $form_panels = array();
        foreach ( $xpath->query( './/input', $root ) as $input ) {
            $placeholder = strtolower( $input->getAttribute( 'placeholder' ) );
            if ( 'email' !== $input->getAttribute( 'type' ) && strpos( $placeholder, 'email' ) === false ) { continue; }
            $candidate = $input->parentNode;
            while ( $candidate && $candidate !== $root && ( $candidate->getElementsByTagName( 'input' )->length < 2 || $candidate->getElementsByTagName( 'button' )->length < 1 ) ) { $candidate = $candidate->parentNode; }
            if ( $candidate && $candidate !== $root && 'section' !== strtolower( $candidate->nodeName ) ) { $form_panels[ spl_object_id( $candidate ) ] = $candidate; }
        }
        foreach ( $form_panels as $panel ) {
            while ( $panel->firstChild ) { $panel->removeChild( $panel->firstChild ); }
            $panel->appendChild( $doc->createElement( 'div' ) )->setAttribute( 'data-visibi-form', '1' );
        }
    }

    // The design's rendered buttons have no prototype handlers. Lead CTAs go to the working form.
    foreach ( $xpath->query( './/button', $root ) as $button ) {
        $label = trim( $button->textContent );
        if ( preg_match( '/audit|enquir|request|submit|send|quote|book|consult/i', $label ) ) {
            $button->setAttribute( 'data-visibi-static-action', '1' );
            $button->setAttribute( 'type', 'button' );
        }
    }
    $blocks = array();
    foreach ( $root->childNodes as $child ) {
        $part = trim( $doc->saveHTML( $child ) );
        if ( $part ) { $blocks[] = '<!-- wp:html -->' . "\n" . $part . "\n" . '<!-- /wp:html -->'; }
    }
    $content = implode( "\n\n", $blocks );
    $content = preg_replace( '#(?<=src=")\.?/?(assets|uploads)/#', '%%VISIBI_THEME_URI%%/assets/source/$1/', $content );
    return $content;
}

// Posts use /insights/slug/ and regular pages retain their own root slugs.
update_option( 'permalink_structure', '/insights/%postname%/' );
update_option( 'blogname', 'VISIBI' );
update_option( 'blogdescription', 'AI visibility, ecommerce, cloud and marketing' );
$counts = array( 'page' => 0, 'post' => 0, 'failed' => 0 );
$ids = array();
foreach ( $items as $item ) {
    $name = $item['name'];
    $type = $item['type'];
    $existing = get_posts( array( 'post_type' => $type, 'post_status' => 'any', 'name' => $item['slug'], 'numberposts' => 1, 'fields' => 'ids' ) );
    $post = array(
        'ID' => $existing ? $existing[0] : 0,
        'post_type' => $type,
        'post_status' => in_array( $name, array( 'Pay Invoice', 'Careers' ), true ) ? 'draft' : 'publish',
        'post_name' => $item['slug'],
        'post_title' => 'Ecommerce Agency Homepage v2' === $name ? 'Ecommerce Development' : ( ! empty( $item['displayTitle'] ) ? $item['displayTitle'] : preg_replace( '/^Article - /', '', $name ) ),
        'post_excerpt' => $item['description'],
        'post_content' => visibi_import_markup( $item['html'], $name ),
    );
    if ( 'post' === $type && ! empty( $item['date'] ) ) { $post['post_date'] = $item['date'] . ' 12:00:00'; }
    if ( 'Home' === $name ) { $post['post_name'] = 'home'; }
    $id = wp_insert_post( wp_slash( $post ), true );
    if ( is_wp_error( $id ) ) { echo 'FAILED ' . $name . ': ' . $id->get_error_message() . "\n"; $counts['failed']++; continue; }
    update_post_meta( $id, '_visibi_source', $item['source'] );
    update_post_meta( $id, '_visibi_seo_title', $item['title'] );
    update_post_meta( $id, '_visibi_seo_description', $item['description'] );
    update_post_meta( $id, '_visibi_onpage', isset( $item['onpage'] ) ? $item['onpage'] : array() );
    update_post_meta( $id, 'rank_math_title', $item['title'] );
    update_post_meta( $id, 'rank_math_description', $item['description'] );
    update_post_meta( $id, '_yoast_wpseo_title', $item['title'] );
    update_post_meta( $id, '_yoast_wpseo_metadesc', $item['description'] );
    if ( 'post' === $type ) {
        if ( ! empty( $item['authorLabel'] ) ) { update_post_meta( $id, '_visibi_author_label', $item['authorLabel'] ); }
        if ( ! empty( $item['category'] ) ) {
            $term = term_exists( $item['category'], 'category' );
            if ( ! $term ) { $term = wp_insert_term( $item['category'], 'category' ); }
            if ( ! is_wp_error( $term ) ) { wp_set_post_terms( $id, array( (int) ( is_array( $term ) ? $term['term_id'] : $term ) ), 'category' ); }
        }
    }
    if ( ! empty( $item['robots'] ) ) {
        update_post_meta( $id, '_visibi_robots', $item['robots'] );
        update_post_meta( $id, 'rank_math_robots', array_map( 'trim', explode( ',', $item['robots'] ) ) );
    }
    $ids[ $name ] = $id;
    $counts[ $type ]++;
}
if ( isset( $ids['Home'] ) ) { update_option( 'show_on_front', 'page' ); update_option( 'page_on_front', $ids['Home'] ); }
if ( isset( $ids['Insights'] ) ) { update_option( 'page_for_posts', 0 ); }

// WordPress menus remain editable in Appearance > Menus.
$primary_names = array( 'GEO', 'AI Agents', 'Marketing and SEO', 'Ecommerce Agency Homepage v2', 'Managed Hosting', 'Insights', 'About', 'Contact' );
$footer_groups = array(
    'AI' => array( 'GEO', 'AI Agents', 'AI Consulting', 'Radar' ),
    'Marketing' => array( 'SEO Services', 'Google Ads Management', 'Paid Social Advertising', 'Email and SMS Marketing', 'Marketing and SEO' ),
    'Ecommerce' => array( 'Adobe Commerce Cloud', 'Magento Open Source', 'Hyva Theme Development', 'Shopify Plus', 'WooCommerce', 'Ecommerce Agency Homepage v2' ),
    'Development' => array( 'React Development', 'Backend Development', 'Mobile App Development', 'DevOps and IaC', 'Development' ),
    'Cloud' => array( 'Cloud Consulting', 'AWS Consulting', 'Azure Consulting', 'Google Cloud Consulting', 'Cloud Cost Optimisation' ),
    'Hosting' => array( 'Web Hosting', 'WordPress Hosting', 'Magento Hosting', 'AWS Managed Hosting', 'Managed Hosting' ),
    'Security' => array( 'Website Security', 'Malware Removal', 'WAF and DDoS Protection', 'Magento Security Hardening', 'WordPress Security Hardening' ),
    'Consulting & Support' => array( 'Software Consulting', 'Ecommerce Consulting', 'Digital Transformation', 'Website Support and Maintenance', 'Application Support' ),
    'Company' => array( 'About', 'Success Stories', 'Insights', 'Contact', 'Privacy', 'Terms' ),
);
$locations = array();
$menu = wp_get_nav_menu_object( 'VISIBI Primary' );
$primary_id = $menu ? $menu->term_id : wp_create_nav_menu( 'VISIBI Primary' );
if ( ! $menu ) {
    foreach ( $primary_names as $name ) {
        if ( isset( $ids[ $name ] ) ) { wp_update_nav_menu_item( $primary_id, 0, array( 'menu-item-object-id' => $ids[ $name ], 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish' ) ); }
    }
}
$locations['primary'] = $primary_id;
$menu = wp_get_nav_menu_object( 'VISIBI Footer' );
$footer_id = $menu ? $menu->term_id : wp_create_nav_menu( 'VISIBI Footer' );
if ( ! $menu ) {
    foreach ( $footer_groups as $heading => $names ) {
        $parent = wp_update_nav_menu_item( $footer_id, 0, array( 'menu-item-title' => $heading, 'menu-item-url' => '#', 'menu-item-type' => 'custom', 'menu-item-status' => 'publish' ) );
        foreach ( $names as $name ) {
            if ( isset( $ids[ $name ] ) ) { wp_update_nav_menu_item( $footer_id, 0, array( 'menu-item-object-id' => $ids[ $name ], 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $parent, 'menu-item-status' => 'publish' ) ); }
        }
    }
}
$locations['footer'] = $footer_id;
set_theme_mod( 'nav_menu_locations', $locations );
require_once __DIR__ . '/seed-navigation.php';
if ( isset( $ids['Ecommerce Agency Homepage v2'] ) ) {
    foreach ( array( $primary_id, $footer_id ) as $menu_id ) {
        foreach ( (array) wp_get_nav_menu_items( $menu_id ) as $menu_item ) {
            if ( (int) $menu_item->object_id === (int) $ids['Ecommerce Agency Homepage v2'] ) {
                wp_update_post( array( 'ID' => $menu_item->ID, 'post_title' => 'Ecommerce' ) );
            }
        }
    }
}
flush_rewrite_rules();
echo wp_json_encode( $counts ) . "\n";
