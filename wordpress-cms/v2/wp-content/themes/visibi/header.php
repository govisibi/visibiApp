<?php
/** Shared header based on the supplied SiteHeader design. */
$primary = visibi_menu_items( 'primary' );
$services = visibi_menu_items( 'services' );
$groups = array();
foreach ( $services as $item ) {
    if ( ! (int) $item->menu_item_parent ) { $groups[ $item->ID ] = array( 'title' => $item->title, 'items' => array() ); }
}
foreach ( $services as $item ) {
    $parent = (int) $item->menu_item_parent;
    if ( $parent && isset( $groups[ $parent ] ) ) { $groups[ $parent ]['items'][] = $item; }
}
$groups = array_values( $groups );
$onpage = is_singular() ? get_post_meta( get_queried_object_id(), '_visibi_onpage', true ) : array();
if ( ! is_array( $onpage ) ) { $onpage = array(); }
$announcements = array(
    array( 'Will your site survive Black Friday? Free peak-readiness audit →', '/peak-traffic-readiness/', '#dc2626' ),
    array( 'Launch offer: 50% off hosting & services — plus an extra 20% with code EXTRA20 →', '/managed-hosting/', '#1d4ed8' ),
    array( 'New: VISIBI Radar — see how ChatGPT & Gemini rank your brand. 7-day free trial →', '/radar/', '#0b1530' ),
);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to content', 'visibi' ); ?></a>
<div class="visibi-announcement" data-visibi-announcement data-messages="<?php echo esc_attr( wp_json_encode( $announcements ) ); ?>">
  <div class="visibi-announcement__inner"><a data-announcement-link href="<?php echo esc_url( home_url( $announcements[0][1] ) ); ?>"><?php echo esc_html( $announcements[0][0] ); ?></a><span class="visibi-announcement__dots" aria-label="Announcements"><button type="button" data-announcement-dot="0" aria-label="Message 1" aria-current="true"></button><button type="button" data-announcement-dot="1" aria-label="Message 2"></button><button type="button" data-announcement-dot="2" aria-label="Message 3"></button></span><button class="visibi-announcement__close" type="button" aria-label="Dismiss announcement">×</button></div>
</div>
<header class="site-header">
  <div class="site-header__inner">
    <a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="VISIBI home">
      <?php if ( has_custom_logo() ) { echo wp_get_attachment_image( get_theme_mod( 'custom_logo' ), 'thumbnail', false, array( 'alt' => '' ) ); } else { ?><svg class="visibi-logo-mark" width="30" height="30" viewBox="0 0 100 100" aria-hidden="true"><g><circle cx="40" cy="40" r="26" fill="none" stroke="white" stroke-width="15"/><circle class="visibi-logo-dot" cx="40" cy="40" r="6" fill="#6f98ff"/><line x1="66" y1="86" x2="90" y2="62" stroke="white" stroke-width="15" stroke-linecap="round"/></g></svg><?php } ?>VISIBI
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation"><ul>
      <?php foreach ( $primary as $item ) : if ( (int) $item->menu_item_parent ) { continue; } ?>
        <?php if ( 'Services' === $item->title ) : ?><li class="menu-item site-nav__services"><details class="site-services" id="site-services"><summary>Services <span aria-hidden="true">▾</span></summary>
          <div class="site-mega"><div class="site-mega__rail" role="tablist" aria-label="Service categories">
            <?php foreach ( $groups as $index => $group ) : ?><button type="button" role="tab" data-service-tab="<?php echo esc_attr( $index ); ?>" aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>"><?php echo esc_html( $group['title'] ); ?><span><?php echo count( $group['items'] ); ?></span></button><?php endforeach; ?>
          </div><div class="site-mega__body">
            <?php foreach ( $groups as $index => $group ) : $promo = visibi_service_promo( $group['title'] ); ?><div class="site-mega__panel" data-service-panel="<?php echo esc_attr( $index ); ?>" <?php echo $index ? 'hidden' : ''; ?>>
              <div class="site-mega__heading"><span><?php echo esc_html( strtoupper( $group['title'] ) ); ?></span><a href="<?php echo esc_url( home_url( $promo[4] ) ); ?>">Explore all →</a></div>
              <div class="site-mega__links"><?php foreach ( $group['items'] as $child ) : ?><a href="<?php echo esc_url( $child->url ); ?>"><strong><?php echo esc_html( $child->title ); ?></strong><?php if ( $child->description ) : ?><small><?php echo esc_html( $child->description ); ?></small><?php endif; ?></a><?php endforeach; ?></div>
            </div><?php endforeach; ?>
          </div><div class="site-mega__promos"><?php foreach ( $groups as $index => $group ) : $promo = visibi_service_promo( $group['title'] ); ?><a data-service-promo="<?php echo esc_attr( $index ); ?>" href="<?php echo esc_url( home_url( $promo[4] ) ); ?>" <?php echo $index ? 'hidden' : ''; ?>><small><?php echo esc_html( $promo[0] ); ?></small><strong><?php echo esc_html( $promo[1] ); ?></strong><span><?php echo esc_html( $promo[2] ); ?></span><b><?php echo esc_html( $promo[3] ); ?> →</b></a><?php endforeach; ?></div></div>
        </details></li><?php else : ?><li class="menu-item<?php echo in_array( 'current-menu-item', (array) $item->classes, true ) ? ' current-menu-item' : ''; ?>"><a href="<?php echo esc_url( $item->url ); ?>"><?php echo esc_html( $item->title ); ?></a></li><?php endif; ?>
      <?php endforeach; ?>
    </ul></nav>
    <a class="site-header__search" href="<?php echo esc_url( home_url( '/search/' ) ); ?>" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16" y2="16"/></svg></a>
    <a class="site-header__cta" href="<?php echo esc_url( home_url( '/contact/#form' ) ); ?>">Free audit →</a>
    <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
  <?php if ( $onpage ) : ?><nav class="site-onpage" aria-label="On this page"><div><span>ON THIS PAGE</span><?php foreach ( $onpage as $link ) : if ( empty( $link['label'] ) || empty( $link['href'] ) || strpos( $link['href'], '#' ) !== 0 ) { continue; } ?><a href="<?php echo esc_attr( $link['href'] ); ?>"><?php echo esc_html( $link['label'] ); ?></a><?php endforeach; ?></div></nav><?php endif; ?>
</header>
