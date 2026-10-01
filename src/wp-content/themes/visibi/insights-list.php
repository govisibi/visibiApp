<?php
/** Render the Insights listing from editable WordPress posts. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function visibi_insights_media( $post, $category, $featured = false ) {
    $title = html_entity_decode( get_the_title( $post ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
    if ( has_post_thumbnail( $post->ID ) ) {
        $attributes = array( 'alt' => wp_strip_all_tags( $title ), 'loading' => $featured ? 'eager' : 'lazy', 'decoding' => 'async', 'sizes' => $featured ? '(max-width: 920px) 90vw, 460px' : '(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 400px' );
        if ( $featured ) { $attributes['fetchpriority'] = 'high'; }
        return '<div class="visibi-insights-media">' . get_the_post_thumbnail( $post->ID, 'visibi-card', $attributes ) . '</div>';
    }

    $colors = array(
        'Security' => array( '#3b0d12', '#fca5a5' ),
        'Performance' => array( '#0b2a3a', '#7dd3fc' ),
        'Cloud' => array( '#0b1f4a', '#93b4ff' ),
        'Hosting' => array( '#10243a', '#93c5fd' ),
        'Ecommerce' => array( '#1a1446', '#c4b5fd' ),
        'Marketing' => array( '#2a1a05', '#fcd34d' ),
        'Analytics' => array( '#062a24', '#6ee7b7' ),
        'Development' => array( '#13203f', '#a5b4fc' ),
        'GEO & AI' => array( '#0b1530', '#6f98ff' ),
    );
    $palette = isset( $colors[ $category ] ) ? $colors[ $category ] : array( '#0b1530', '#6f98ff' );
    $short_title = trim( preg_split( '/[:?\x{2014}]/u', $title, 2 )[0] );
    if ( '' === $short_title ) { $short_title = $title; }
    return '<div class="visibi-insights-media visibi-insights-cover" style="--visibi-cover-dark:' . esc_attr( $palette[0] ) . ';--visibi-cover-accent:' . esc_attr( $palette[1] ) . '" aria-hidden="true">'
        . '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" aria-hidden="true">'
        . '<div class="visibi-insights-cover__copy"><span>' . esc_html( strtoupper( $category ) ) . '</span><strong>' . esc_html( $short_title ) . '</strong></div></div>';
}

add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'insights' ) || get_the_ID() !== get_queried_object_id() ) { return $content; }
    $posts = get_posts( array( 'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
    $cards = array();
    $featured_card = '';
    foreach ( $posts as $post ) {
        if ( ! get_post_meta( $post->ID, '_visibi_source', true ) ) { continue; }
        $categories = get_the_category( $post->ID );
        $category = $categories ? html_entity_decode( $categories[0]->name, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) : 'Insights';
        $title = html_entity_decode( get_the_title( $post ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
        $excerpt = html_entity_decode( get_the_excerpt( $post ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
        $minutes = max( 1, (int) ceil( str_word_count( wp_strip_all_tags( $post->post_content ) ) / 220 ) );
        $media = visibi_insights_media( $post, $category, '' === $featured_card );
        $url = esc_url( get_permalink( $post ) );
        if ( '' === $featured_card ) {
            $featured_card = '<a href="' . $url . '" class="visibi-insights-featured">' . $media
                . '<div class="visibi-insights-featured__body"><div class="visibi-insights-eyebrow"><span class="visibi-insights-eyebrow__category">FEATURED &middot; ' . esc_html( strtoupper( $category ) ) . '</span><span>' . esc_html( $minutes ) . ' MIN READ</span></div>'
                . '<h2 class="visibi-insights-featured__title">' . esc_html( $title ) . '</h2>'
                . '<p class="visibi-insights-featured__excerpt">' . esc_html( wp_trim_words( $excerpt, 30 ) ) . '</p>'
                . '<span class="visibi-insights-featured__more">Read the guide &rarr;</span></div></a>';
            continue;
        }
        $search = strtolower( $title . ' ' . $excerpt . ' ' . $category );
        $cards[] = '<a href="' . $url . '" class="visibi-insights-card" data-visibi-insight-card data-category="' . esc_attr( $category ) . '" data-search="' . esc_attr( $search ) . '">' . $media
            . '<div class="visibi-insights-card__body"><div class="visibi-insights-eyebrow"><span class="visibi-insights-eyebrow__category">' . esc_html( strtoupper( $category ) ) . '</span><span>' . esc_html( $minutes ) . ' MIN READ</span></div>'
            . '<h2 class="visibi-insights-card__title">' . esc_html( $title ) . '</h2>'
            . '<p class="visibi-insights-card__excerpt">' . esc_html( wp_trim_words( $excerpt, 30 ) ) . '</p>'
            . '<span class="visibi-insights-card__more">Read the guide &rarr;</span></div></a>';
    }
    $content = preg_replace_callback( '#<section\b[^>]*data-screen-label="Featured"[^>]*>[\s\S]*?</section>#i', function ( $match ) use ( $featured_card ) {
        $open = substr( $match[0], 0, strpos( $match[0], '>' ) + 1 );
        return $open . $featured_card . '</section>';
    }, $content, 1 );
    return preg_replace_callback( '#<section\b[^>]*data-screen-label="Articles"[^>]*>[\s\S]*?</section>#i', function ( $match ) use ( $cards ) {
        $open = substr( $match[0], 0, strpos( $match[0], '>' ) );
        return $open . ' data-visibi-insights-list>' . implode( "\n", $cards )
            . '<div data-visibi-insights-more-wrap style="grid-column:1/-1;display:flex;justify-content:center;padding-top:8px"><button type="button" data-visibi-insights-more hidden style="border:1px solid #cbd3e6;background:#fff;color:#0b1530;border-radius:999px;padding:14px 24px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit"></button></div>'
            . '<p data-visibi-insights-empty hidden style="grid-column:1/-1">No guides match your filter.</p></section>';
    }, $content, 1 );
}, 20 );
