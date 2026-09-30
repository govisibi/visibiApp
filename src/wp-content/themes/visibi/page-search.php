<?php
/** Functional search page using the supplied Search layout. */
$query_text = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '';
$selected_type = isset( $_GET['type'] ) ? sanitize_key( wp_unslash( $_GET['type'] ) ) : 'all';
$found = new WP_Query( array( 'post_type' => array( 'page', 'post' ), 'post_status' => 'publish', 's' => $query_text, 'posts_per_page' => -1, 'orderby' => 'relevance' ) );
$results = array();
$counts = array( 'all' => 0, 'service' => 0, 'guide' => 0, 'tool' => 0, 'page' => 0 );
foreach ( $found->posts as $result ) {
    if ( 'post' === $result->post_type ) { $type = 'guide'; }
    elseif ( in_array( $result->post_name, array( 'radar', 'guard', 'tools' ), true ) ) { $type = 'tool'; }
    elseif ( in_array( $result->post_name, array( 'home', 'about', 'contact', 'privacy', 'terms', 'insights', 'search', 'sitemap', 'success-stories' ), true ) ) { $type = 'page'; }
    else { $type = 'service'; }
    $results[] = array( 'post' => $result, 'type' => $type );
    $counts['all']++;
    $counts[ $type ]++;
}
wp_reset_postdata();
$shown = array_values( array_filter( $results, function ( $row ) use ( $selected_type ) { return 'all' === $selected_type || $row['type'] === $selected_type; } ) );
$url = home_url( '/search/' );
get_header();
?>
<main id="main-content" class="visibi-content">
  <section data-screen-label="Search" style="background:#070e22;color:#fff">
    <div style="max-width:880px;margin:0 auto;padding:clamp(32px,4.5vw,52px) clamp(20px,5vw,40px);display:flex;flex-direction:column;gap:20px">
      <div style="font:500 12px 'JetBrains Mono',monospace;letter-spacing:.1em;color:#6f98ff">SEARCH</div>
      <h1 style="margin:0;font-size:clamp(32px,6vw,52px);font-weight:800;letter-spacing:-.04em;line-height:1.05">What can we help you with?</h1>
      <form method="get" action="<?php echo esc_url( $url ); ?>" class="visibi-search" role="search">
        <span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16" y2="16"/></svg></span>
        <input type="search" name="q" value="<?php echo esc_attr( $query_text ); ?>" placeholder="Try “Magento hosting”, “hacked site” or “AWS costs”" aria-label="Search services and guides">
        <?php if ( $query_text ) : ?><a href="<?php echo esc_url( $url ); ?>">Clear</a><?php endif; ?>
        <button type="submit">Search</button>
      </form>
      <div class="visibi-search-popular"><span>Popular:</span><?php foreach ( array( 'Magento hosting', 'Hacked website', 'AWS cost', 'Black Friday', 'SEO', 'GA4 tracking', 'Shopify Plus', 'AI visibility' ) as $term ) : ?><a href="<?php echo esc_url( add_query_arg( 'q', $term, $url ) ); ?>"><?php echo esc_html( $term ); ?></a><?php endforeach; ?></div>
    </div>
  </section>
  <section data-screen-label="Results" class="visibi-search-results">
    <div class="visibi-search-filters"><?php foreach ( array( 'all' => 'All', 'service' => 'Services', 'guide' => 'Guides', 'tool' => 'Tools', 'page' => 'Pages' ) as $key => $label ) : if ( ! $counts[ $key ] && 'all' !== $key ) { continue; } ?><a class="<?php echo $key === $selected_type ? 'is-active' : ''; ?>" href="<?php echo esc_url( add_query_arg( array( 'q' => $query_text, 'type' => $key ), $url ) ); ?>"><?php echo esc_html( $label ); ?> <span><?php echo esc_html( $counts[ $key ] ); ?></span></a><?php endforeach; ?></div>
    <p><?php echo $query_text ? esc_html( count( $shown ) . ' results for “' . $query_text . '”' ) : 'Popular services, guides and tools'; ?></p>
    <div class="visibi-search-list"><?php foreach ( array_slice( $shown, 0, 40 ) as $row ) : $result = $row['post']; ?><a href="<?php echo esc_url( get_permalink( $result ) ); ?>"><small><?php echo esc_html( strtoupper( $row['type'] ) ); ?></small><strong><?php echo esc_html( get_the_title( $result ) ); ?></strong><span><?php echo esc_html( wp_strip_all_tags( get_the_excerpt( $result ) ) ); ?></span></a><?php endforeach; ?></div>
    <?php if ( $query_text && ! $shown ) : ?><div class="visibi-search-empty"><h2>No results for “<?php echo esc_html( $query_text ); ?>”.</h2><p>Tell us what you need and a specialist will reply within 24 hours.</p><a class="visibi-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Ask a specialist →</a></div><?php endif; ?>
  </section>
</main>
<?php get_footer(); ?>
