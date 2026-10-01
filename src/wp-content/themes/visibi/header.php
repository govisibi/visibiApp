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
$mobile_before = array();
$mobile_after = array();
$past_services = false;
foreach ( $primary as $item ) {
    if ( (int) $item->menu_item_parent ) { continue; }
    if ( 'Services' === $item->title ) { $past_services = true; continue; }
    if ( $past_services ) { $mobile_after[] = $item; } else { $mobile_before[] = $item; }
}
$header_cta = home_url( '/contact/#form' );
foreach ( $onpage as $link ) {
    if ( ! empty( $link['href'] ) && ! empty( $link['label'] ) && stripos( $link['label'], 'audit' ) !== false && strpos( $link['href'], '#' ) === 0 ) {
        $header_cta = $link['href'];
        break;
    }
}
$show_black_friday_menu = ! is_page( array( 'peak-traffic-readiness', 'black-friday-website-readiness' ) );
$black_friday_now = new DateTimeImmutable( 'now', wp_timezone() );
$black_friday_year = (int) $black_friday_now->format( 'Y' );
if ( (int) $black_friday_now->format( 'n' ) === 12 && (int) $black_friday_now->format( 'j' ) > 27 ) { ++$black_friday_year; }
$black_friday_november = new DateTimeImmutable( $black_friday_year . '-11-01', wp_timezone() );
$black_friday_first_thursday = ( 4 - (int) $black_friday_november->format( 'w' ) + 7 ) % 7;
$black_friday_date = $black_friday_november->modify( '+' . ( $black_friday_first_thursday + 22 ) . ' days' );
$black_friday_days = max( 0, (int) ceil( ( $black_friday_date->getTimestamp() - $black_friday_now->getTimestamp() ) / DAY_IN_SECONDS ) );
$black_friday_display = $black_friday_days ? (string) $black_friday_days : 'LIVE';
$black_friday_href = home_url( '/peak-traffic-readiness/' );
$announcements = array(
    array( 'Will your site survive Black Friday? Free peak-readiness audit →', '/peak-traffic-readiness/', '#dc2626' ),
    array( 'Limited-time offer: 50% off hosting & services — plus an extra 20% with code EXTRA20 →', '/managed-hosting/', '#1d4ed8' ),
    array( 'New: VISIBI Radar — see how ChatGPT & Gemini rank your brand. 7-day free trial →', '/radar/', '#0b1530' ),
);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-M44X766F');</script>
<!-- End Google Tag Manager -->
<meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M44X766F" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
          </div><div class="site-mega__promos"><?php foreach ( $groups as $index => $group ) : $promo = visibi_service_promo( $group['title'] ); ?><a data-service-promo="<?php echo esc_attr( $index ); ?>" href="<?php echo esc_url( home_url( $promo[4] ) ); ?>" <?php echo $index ? 'hidden' : ''; ?>><small><?php echo esc_html( $promo[0] ); ?></small><strong><?php echo esc_html( $promo[1] ); ?></strong><span><?php echo esc_html( $promo[2] ); ?></span><b><?php echo esc_html( $promo[3] ); ?> →</b></a><?php endforeach; ?></div><?php if ( $show_black_friday_menu ) : ?>
          <a class="site-mega__black-friday" data-black-friday-promo href="<?php echo esc_url( $black_friday_href ); ?>" title="Black Friday website readiness — load testing &amp; 24/7 cover">
            <span class="site-mega__black-friday-badge">BLACK FRIDAY <span data-black-friday-year><?php echo esc_html( $black_friday_year ); ?></span></span>
            <span class="site-mega__black-friday-copy"><strong>Will your site stay online on Black Friday?</strong><span>Load testing, autoscaling and a 24/7 war room — free peak-readiness audit.</span></span>
            <span class="site-mega__black-friday-count"><strong data-black-friday-days><?php echo esc_html( $black_friday_display ); ?></strong><small data-black-friday-days-label<?php echo $black_friday_days ? '' : ' hidden'; ?>>DAYS TO GO</small></span>
            <span class="site-mega__black-friday-cta">Get ready <span aria-hidden="true">→</span></span>
          </a><?php endif; ?></div>
        </details></li><?php else : ?><li class="menu-item<?php echo in_array( 'current-menu-item', (array) $item->classes, true ) ? ' current-menu-item' : ''; ?>"><a href="<?php echo esc_url( $item->url ); ?>"><?php echo esc_html( $item->title ); ?></a></li><?php endif; ?>
      <?php endforeach; ?>
    </ul></nav>
    <a class="site-header__search" href="<?php echo esc_url( home_url( '/search/' ) ); ?>" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16" y2="16"/></svg></a>
    <a class="site-header__cta" href="<?php echo esc_url( $header_cta ); ?>">Free audit<span class="site-header__cta-arrow" aria-hidden="true"> →</span></a>
    <button class="menu-toggle" type="button" aria-controls="site-mobile-sheet" aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
  <?php if ( $onpage ) : ?><nav class="site-onpage" aria-label="On this page"><div class="site-onpage__wide"><span>ON THIS PAGE</span><?php foreach ( $onpage as $link ) : if ( empty( $link['label'] ) || empty( $link['href'] ) || strpos( $link['href'], '#' ) !== 0 ) { continue; } ?><a href="<?php echo esc_attr( $link['href'] ); ?>"><?php echo esc_html( $link['label'] ); ?></a><?php endforeach; ?></div><button class="site-onpage__mobile" type="button" aria-controls="site-mobile-sheet" aria-expanded="false"><span>On this page</span><span><small><?php echo count( $onpage ); ?></small><b aria-hidden="true">↓</b></span></button></nav><?php endif; ?>
</header>
<div class="site-mobile-sheet" id="site-mobile-sheet" hidden>
  <div class="site-mobile-sheet__inner">
    <?php if ( $onpage ) : ?><div class="site-mobile-sheet__tabs" role="tablist" aria-label="Mobile navigation"><button type="button" role="tab" data-mobile-tab="menu" aria-selected="true">Menu</button><button type="button" role="tab" data-mobile-tab="onpage" aria-selected="false">On this page</button></div><?php endif; ?>
    <div class="site-mobile-sheet__panel" data-mobile-panel="menu">
      <section class="site-mobile-sheet__section" aria-label="AI"><h2>AI</h2>
        <?php foreach ( $mobile_before as $item ) : ?><a class="site-mobile-sheet__link" href="<?php echo esc_url( $item->url ); ?>"><?php echo esc_html( $item->title ); ?><span aria-hidden="true">→</span></a><?php endforeach; ?>
      </section>
      <section class="site-mobile-sheet__section" aria-label="Services"><h2>SERVICES</h2>
        <?php foreach ( $groups as $group ) : $promo = visibi_service_promo( $group['title'] ); ?><details class="site-mobile-service"><summary><?php echo esc_html( $group['title'] ); ?><span><small><?php echo count( $group['items'] ); ?></small><b aria-hidden="true">+</b></span></summary><div class="site-mobile-service__content"><div class="site-mobile-service__links">
          <?php foreach ( $group['items'] as $child ) : ?><a href="<?php echo esc_url( $child->url ); ?>"><?php echo esc_html( $child->title ); ?></a><?php endforeach; ?>
        </div><a class="site-mobile-service__promo" href="<?php echo esc_url( home_url( $promo[4] ) ); ?>"><span><small><?php echo esc_html( $promo[0] ); ?></small><strong><?php echo esc_html( $promo[3] ); ?></strong></span><b aria-hidden="true">→</b></a></div></details><?php endforeach; ?>
      </section>
      <section class="site-mobile-sheet__section" aria-label="Company"><h2>COMPANY</h2>
        <?php $contact_in_menu = false; foreach ( $mobile_after as $item ) : if ( 'Contact' === $item->title ) { $contact_in_menu = true; } ?><a class="site-mobile-sheet__link" href="<?php echo esc_url( $item->url ); ?>"><?php echo esc_html( $item->title ); ?><span aria-hidden="true">→</span></a><?php endforeach; ?>
        <?php if ( ! $contact_in_menu ) : ?><a class="site-mobile-sheet__link" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact<span aria-hidden="true">→</span></a><?php endif; ?>
      </section>
      <?php if ( $show_black_friday_menu ) : ?><a class="site-mobile-sheet__black-friday" data-black-friday-promo href="<?php echo esc_url( $black_friday_href ); ?>" title="Black Friday website readiness — load testing &amp; 24/7 cover">
        <span class="site-mobile-sheet__black-friday-copy"><small>BLACK FRIDAY · <span data-black-friday-days><?php echo esc_html( $black_friday_display ); ?></span><span data-black-friday-days-label<?php echo $black_friday_days ? '' : ' hidden'; ?>> DAYS TO GO</span></small><strong>Will your site stay online?</strong><span>Free peak-readiness audit</span></span><span class="site-mobile-sheet__black-friday-arrow" aria-hidden="true">→</span>
      </a><?php endif; ?>
      <a class="site-mobile-sheet__audit" href="<?php echo esc_url( $header_cta ); ?>"><small>FREE · 24H REPLY</small><strong>Free audit →</strong></a>
      <div class="site-mobile-sheet__bottom"><a href="mailto:hello@govisibi.ai">hello@govisibi.ai</a><a href="<?php echo esc_url( home_url( '/about/#meet' ) ); ?>">Book a meeting →</a></div>
    </div>
    <?php if ( $onpage ) : ?><div class="site-mobile-sheet__panel" data-mobile-panel="onpage" hidden>
      <?php foreach ( $onpage as $index => $link ) : if ( empty( $link['label'] ) || empty( $link['href'] ) || strpos( $link['href'], '#' ) !== 0 ) { continue; } ?><a class="site-mobile-sheet__onpage-link" href="<?php echo esc_attr( $link['href'] ); ?>"><small><?php echo esc_html( sprintf( '%02d', $index + 1 ) ); ?></small><strong><?php echo esc_html( $link['label'] ); ?></strong><span aria-hidden="true">↓</span></a><?php endforeach; ?>
    </div><?php endif; ?>
  </div>
</div>

<?php
if ( ! is_front_page() && ! is_404() ) :
    $breadcrumb_links = array( array( 'Home', home_url( '/' ) ) );
    $page_id = get_queried_object_id();
    if ( is_singular( 'post' ) ) {
        $insights_page = get_page_by_path( 'insights' );
        $breadcrumb_links[] = array( 'Insights', $insights_page ? get_permalink( $insights_page ) : home_url( '/insights/' ) );
    } elseif ( is_page() ) {
        $ancestors = array_reverse( get_post_ancestors( $page_id ) );
        if ( $ancestors ) {
            foreach ( $ancestors as $ancestor_id ) {
                $breadcrumb_links[] = array( get_the_title( $ancestor_id ), get_permalink( $ancestor_id ) );
            }
        } else {
            $in_primary = false;
            foreach ( $primary as $item ) {
                if ( (int) $item->object_id === $page_id && 'page' === $item->object ) { $in_primary = true; break; }
            }
            $page_slug = get_post_field( 'post_name', $page_id );
            if ( ! $in_primary ) {
                if ( in_array( $page_slug, array( 'radar', 'guard' ), true ) ) {
                    $tools_page = get_page_by_path( 'tools' );
                    if ( $tools_page ) { $breadcrumb_links[] = array( 'Tools', get_permalink( $tools_page ) ); }
                } elseif ( 'careers' === $page_slug ) {
                    $about_page = get_page_by_path( 'about' );
                    if ( $about_page ) { $breadcrumb_links[] = array( 'About', get_permalink( $about_page ) ); }
                } else {
                    $service_group = null;
                    foreach ( $groups as $group ) {
                        foreach ( $group['items'] as $item ) {
                            if ( (int) $item->object_id === $page_id && 'page' === $item->object ) { $service_group = $group['title']; break 2; }
                        }
                    }
                    if ( ! $service_group && in_array( $page_slug, array( 'ios-app-development', 'wordpress-development', 'vue-development', 'react-native-development', 'python-development', 'php-development', 'node-js-development', 'laravel-development', 'flutter-app-development', 'angular-development', 'android-app-development' ), true ) ) {
                        $service_group = 'Development';
                    }
                    if ( $service_group ) {
                        $breadcrumb_links[] = array( 'Services', '' );
                        $category_pages = array( 'Marketing' => 'marketing-and-seo', 'Development' => 'development', 'Ecommerce' => 'ecommerce-development', 'Cloud' => 'cloud-consulting', 'Hosting' => 'managed-hosting', 'Security' => 'website-security', 'Support' => 'website-support-and-maintenance' );
                        $landing_slug = isset( $category_pages[ $service_group ] ) ? $category_pages[ $service_group ] : '';
                        $landing_page = $landing_slug ? get_page_by_path( $landing_slug ) : null;
                        if ( $landing_page && (int) $landing_page->ID !== $page_id ) {
                            $breadcrumb_links[] = array( $service_group, get_permalink( $landing_page ) );
                        } elseif ( ! $landing_page ) {
                            $breadcrumb_links[] = array( $service_group, '' );
                        }
                    }
                }
            }
        }
    }
    if ( is_singular() ) {
        $breadcrumb_current = get_the_title( $page_id );
    } elseif ( is_search() ) {
        $breadcrumb_current = 'Search results';
    } elseif ( is_category() || is_tag() || is_tax() ) {
        $breadcrumb_current = single_term_title( '', false );
    } elseif ( is_post_type_archive() ) {
        $breadcrumb_current = post_type_archive_title( '', false );
    } else {
        $breadcrumb_current = 'Insights';
    }
?>
<nav class="visibi-breadcrumb" aria-label="Breadcrumb"><ol>
  <?php foreach ( $breadcrumb_links as $crumb ) : ?><li><?php if ( $crumb[1] ) : ?><a href="<?php echo esc_url( $crumb[1] ); ?>"><?php echo esc_html( $crumb[0] ); ?></a><?php else : ?><?php echo esc_html( $crumb[0] ); ?><?php endif; ?></li><?php endforeach; ?>
  <li aria-current="page"><?php echo esc_html( $breadcrumb_current ); ?></li>
</ol></nav>
<?php endif; ?>
