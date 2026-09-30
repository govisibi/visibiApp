<?php
/** Render the Insights cards from editable WordPress posts. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'insights' ) || get_the_ID() !== get_queried_object_id() ) { return $content; }
    $posts = get_posts( array( 'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
    $cards = array();
    foreach ( $posts as $post ) {
        if ( ! get_post_meta( $post->ID, '_visibi_source', true ) || $post->post_name === 'stop-stock-integrations-triggering-full-magento-reindexing' ) { continue; }
        $categories = get_the_category( $post->ID );
        $category = $categories ? $categories[0]->name : 'Insights';
        $title = get_the_title( $post );
        $excerpt = get_the_excerpt( $post );
        $minutes = max( 1, (int) ceil( str_word_count( wp_strip_all_tags( $post->post_content ) ) / 220 ) );
        $search = strtolower( $title . ' ' . $excerpt . ' ' . $category );
        $cards[] = '<a href="' . esc_url( get_permalink( $post ) ) . '" class="scp1" data-visibi-insight-card data-category="' . esc_attr( $category ) . '" data-search="' . esc_attr( $search ) . '" style="border:1px solid #e3e8f2;border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:12px;color:#0b1530;background:#fff;text-decoration:none">'
            . '<div style="display:flex;gap:10px;font:500 11px JetBrains Mono,monospace;color:#5a6680;letter-spacing:.06em"><span style="color:#1d4ed8">' . esc_html( strtoupper( $category ) ) . '</span><span>' . esc_html( $minutes ) . ' MIN READ</span></div>'
            . '<div style="font-size:20px;font-weight:700;line-height:1.25;letter-spacing:-.01em">' . esc_html( $title ) . '</div>'
            . '<div style="font-size:15px;color:#5a6680;font-weight:300;line-height:1.6">' . esc_html( wp_trim_words( $excerpt, 30 ) ) . '</div>'
            . '<div style="margin-top:auto;padding-top:8px;font-size:14px;font-weight:600;color:#1d4ed8">Read the guide &rarr;</div></a>';
    }
    return preg_replace_callback( '#<section\b[^>]*data-screen-label="Articles"[^>]*>[\s\S]*?</section>#i', function ( $match ) use ( $cards ) {
        $open = substr( $match[0], 0, strpos( $match[0], '>' ) );
        return $open . ' data-visibi-insights-list>' . implode( "\n", $cards )
            . '<div data-visibi-insights-more-wrap style="grid-column:1/-1;display:flex;justify-content:center;padding-top:8px"><button type="button" data-visibi-insights-more hidden style="border:1px solid #cbd3e6;background:#fff;color:#0b1530;border-radius:999px;padding:14px 24px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit"></button></div>'
            . '<p data-visibi-insights-empty hidden style="grid-column:1/-1">No guides match your filter.</p></section>';
    }, $content, 1 );
}, 20 );
