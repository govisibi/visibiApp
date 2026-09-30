<?php
/** VISIBI theme setup. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
require_once __DIR__ . '/insights-list.php';
require_once __DIR__ . '/forms-extra.php';

add_action( 'after_setup_theme', function () {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array( 'height' => 60, 'width' => 60, 'flex-height' => true, 'flex-width' => true ) );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array( 'primary' => 'Primary navigation', 'services' => 'Services mega menu', 'footer' => 'Footer navigation' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_style( 'visibi-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap', array(), null );
    wp_enqueue_style( 'visibi-style', get_stylesheet_uri(), array( 'visibi-fonts' ), wp_get_theme()->get( 'Version' ) );
    wp_enqueue_script( 'visibi-site', get_template_directory_uri() . '/assets/site.js', array(), wp_get_theme()->get( 'Version' ), true );
    if ( is_page( 'insights' ) ) {
        wp_enqueue_script( 'visibi-insights', get_template_directory_uri() . '/assets/insights.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
    }
    if ( is_page() ) {
        $page_content = (string) get_post_field( 'post_content', get_queried_object_id() );
        $service_data = json_decode( (string) file_get_contents( __DIR__ . '/assets/service-interactions-data.json' ), true );
        if ( isset( $service_data[ get_post_field( 'post_name', get_queried_object_id() ) ] ) ) {
            wp_enqueue_script( 'visibi-service-interactions', get_template_directory_uri() . '/assets/service-interactions.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
        }
        if ( str_contains( $page_content, 'Simulate Black Friday spike' ) || str_contains( $page_content, 'STORE AUDIT' ) || ( str_contains( $page_content, 'How big?' ) && str_contains( $page_content, 'Dedicated dev' ) ) ) {
            wp_enqueue_script( 'visibi-hero-demos', get_template_directory_uri() . '/assets/hero-demos.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
        }
    }
    if ( is_page( 'ai-agents' ) ) {
        wp_enqueue_script( 'visibi-ai-agents', get_template_directory_uri() . '/assets/ai-agents.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
    }
    if ( is_page( 'peak-traffic-readiness' ) ) {
        wp_enqueue_script( 'visibi-peak-calculator', get_template_directory_uri() . '/assets/peak-calculator.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
    }
    if ( is_page( 'about' ) || is_page( 'careers' ) ) {
        wp_enqueue_script( 'visibi-form-choices', get_template_directory_uri() . '/assets/form-choices.js', array( 'visibi-site' ), wp_get_theme()->get( 'Version' ), true );
    }
    if ( is_front_page() ) {
        wp_enqueue_script( 'visibi-dodge', get_template_directory_uri() . '/assets/dodge-game.js', array(), wp_get_theme()->get( 'Version' ), true );
        wp_enqueue_script( 'visibi-home-logos', get_template_directory_uri() . '/assets/home-logos.js', array(), wp_get_theme()->get( 'Version' ), true );
    }
    wp_add_inline_script( 'visibi-site', 'window.visibiSite=' . wp_json_encode( array( 'base' => home_url( '/' ), 'theme' => get_template_directory_uri() ) ) . ';', 'before' );
} );

function visibi_menu_fallback() {
    echo '<ul>';
    foreach ( array( 'GEO' => 'geo', 'AI Agents' => 'ai-agents', 'Services' => 'marketing-and-seo', 'Insights' => 'insights', 'About' => 'about', 'Contact' => 'contact' ) as $label => $slug ) {
        echo '<li><a href="' . esc_url( home_url( '/' . $slug . '/' ) ) . '">' . esc_html( $label ) . '</a></li>';
    }
    echo '</ul>';
}

function visibi_menu_items( $location ) {
    $locations = get_nav_menu_locations();
    if ( empty( $locations[ $location ] ) ) { return array(); }
    return (array) wp_get_nav_menu_items( $locations[ $location ] );
}

function visibi_service_promo( $category ) {
    $promos = array(
        'AI' => array( 'FREE · 24H', 'How does AI see your brand?', 'See if ChatGPT, Gemini and Perplexity recommend you.', 'Free AI visibility audit', '/geo/' ),
        'Marketing' => array( 'FREE AUDIT', 'Find the revenue you are missing.', 'SEO, ads and tracking reviewed by a specialist.', 'Get a free marketing audit', '/marketing-and-seo/#audit' ),
        'Development' => array( 'FREE QUOTE', 'Senior developers, fixed prices.', 'New build, takeover or ongoing development.', 'Get a free quote', '/contact/' ),
        'Ecommerce' => array( 'FREE STORE AUDIT', 'Is your store leaking sales?', 'Speed, UX and platform review by a certified developer.', 'Get a free store audit', '/ecommerce-development/#start' ),
        'Cloud' => array( 'FREE · 48H', 'What could you save on cloud?', 'Free savings estimate for AWS, Azure, Google Cloud or Oracle.', 'Get a free savings estimate', '/cloud-cost-optimisation/#audit' ),
        'Hosting' => array( '50% OFF + EXTRA20', 'Faster hosting for less.', 'Free migration on every plan.', 'Compare hosting plans', '/managed-hosting/' ),
        'Security' => array( 'HACKED RIGHT NOW?', 'Emergency cleanup, started within 4 hours.', 'Skimmers, spam, redirects and blocklist warnings removed.', 'Get emergency help', '/malware-removal/#audit' ),
        'Consulting' => array( 'FREE 45-MIN CALL', 'Talk to a senior consultant.', 'Honest advice on AI, software, ecommerce or cloud.', 'Book a free call', '/contact/#form' ),
        'Support' => array( 'FREE HEALTH CHECK', 'A developer on call.', 'Patches, backups, monitoring and fixes.', 'Get a free health check', '/website-support-and-maintenance/#audit' ),
    );
    return isset( $promos[ $category ] ) ? $promos[ $category ] : $promos['AI'];
}

/** Metadata is editable in Rank Math; these tags are a fallback until that plugin is active. */
function visibi_has_seo_plugin() {
    return defined( 'RANK_MATH_VERSION' ) || defined( 'WPSEO_VERSION' );
}
add_filter( 'pre_get_document_title', function ( $title ) {
    if ( ! visibi_has_seo_plugin() && is_singular() ) {
        $custom = get_post_meta( get_queried_object_id(), '_visibi_seo_title', true );
        if ( $custom ) { return $custom; }
    }
    return $title;
}, 20 );
add_action( 'wp_head', function () {
    if ( visibi_has_seo_plugin() || ! is_singular() ) { return; }
    $description = get_post_meta( get_queried_object_id(), '_visibi_seo_description', true );
    if ( $description ) {
        echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";
    }
    echo '<meta property="og:type" content="' . ( is_single() ? 'article' : 'website' ) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr( wp_get_document_title() ) . '">' . "\n";
    if ( $description ) { echo '<meta property="og:description" content="' . esc_attr( $description ) . '">' . "\n"; }
    echo '<meta property="og:url" content="' . esc_url( get_permalink() ) . '">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
}, 5 );

/** A simple, editable fallback form. Fluent Forms can replace this shortcode after configuration. */
add_shortcode( 'visibi_lead_form', function ( $atts ) {
    if ( is_page( 'careers' ) ) { return visibi_career_form(); }
    if ( is_page( 'about' ) ) { return visibi_meeting_form(); }
    $default_need = is_page( 'contact' ) ? 'Free AI visibility audit' : 'Enquiry about ' . get_the_title();
    $atts = shortcode_atts( array( 'need' => $default_need ), $atts );
    $fluent_id = absint( get_option( 'visibi_fluent_form_id', 0 ) );
    if ( $fluent_id && shortcode_exists( 'fluentform' ) ) {
        return do_shortcode( '[fluentform id="' . $fluent_id . '"]' );
    }
    ob_start();
    $state = isset( $_GET['visibi_form'] ) ? sanitize_key( wp_unslash( $_GET['visibi_form'] ) ) : '';
    ?>
    <form id="visibi-enquiry" class="visibi-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
      <?php echo visibi_form_message( $state, 'enquiry' ); ?>
      <input type="hidden" name="action" value="visibi_lead">
      <input type="hidden" name="visibi_return" value="<?php echo esc_url( get_permalink() ); ?>">
      <?php wp_nonce_field( 'visibi_lead', 'visibi_nonce' ); ?>
      <label class="visibi-form__honeypot" aria-hidden="true">Leave this empty<input type="text" name="visibi_check_field" tabindex="-1" autocomplete="new-password"></label>
      <label>Name <input name="visibi_name" autocomplete="name" required maxlength="120"></label>
      <label>Email <input type="email" name="visibi_email" autocomplete="email" required maxlength="190"></label>
      <label>Phone number <input type="tel" name="visibi_phone" autocomplete="tel" required maxlength="40"></label>
      <label>Website URL <input type="text" name="visibi_url" inputmode="url" autocomplete="url" placeholder="example.com or https://example.com" maxlength="255"></label>
      <label>What do you need?
        <select name="visibi_need"><option><?php echo esc_html( $atts['need'] ); ?></option><option>AI agents</option><option>SEO &amp; PPC</option><option>Ecommerce build</option><option>Managed hosting</option><option>Other</option></select>
      </label>
      <label>Anything we should know? <textarea name="visibi_message" rows="3" maxlength="3000"></textarea></label>
      <button class="visibi-button" type="submit">Send enquiry &rarr;</button>
      <small>Free consultation. No obligation.</small>
    </form>
    <?php
    return ob_get_clean();
} );

add_action( 'admin_init', function () {
    register_setting( 'general', 'visibi_fluent_form_id', array( 'type' => 'integer', 'sanitize_callback' => 'absint', 'default' => 0 ) );
    add_settings_field( 'visibi_fluent_form_id', 'VISIBI Fluent Form ID', function () {
        echo '<input type="number" min="0" name="visibi_fluent_form_id" value="' . esc_attr( get_option( 'visibi_fluent_form_id', 0 ) ) . '" class="small-text">';
        echo '<p class="description">Set this after creating the lead form in Fluent Forms. Use 0 for the built-in form.</p>';
    }, 'general' );
} );

add_action( 'init', function () {
    register_post_type( 'visibi_lead', array( 'labels' => array( 'name' => 'Enquiries', 'singular_name' => 'Enquiry' ), 'public' => false, 'show_ui' => true, 'show_in_menu' => true, 'supports' => array( 'title', 'editor' ), 'capability_type' => 'post', 'map_meta_cap' => true ) );
} );
add_filter( 'manage_visibi_lead_posts_columns', function ( $columns ) {
    $columns['visibi_email_status'] = 'Email notification';
    return $columns;
} );
add_action( 'manage_visibi_lead_posts_custom_column', function ( $column, $post_id ) {
    if ( 'visibi_email_status' !== $column ) { return; }
    $status = get_post_meta( $post_id, '_visibi_email_status', true );
    echo esc_html( 'sent' === $status ? 'Sent' : ( 'failed' === $status ? 'Failed — check mail settings' : 'Not recorded' ) );
}, 10, 2 );

function visibi_handle_lead() {
    $return = isset( $_POST['visibi_return'] ) ? esc_url_raw( wp_unslash( $_POST['visibi_return'] ) ) : home_url( '/contact/' );
    $return = wp_validate_redirect( $return, home_url( '/contact/' ) );
    $nonce = isset( $_POST['visibi_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_nonce'] ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'visibi_lead' ) || ! empty( $_POST['visibi_check_field'] ) ) { visibi_form_redirect( $return, 'error' ); }
    $name = isset( $_POST['visibi_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_name'] ) ) : '';
    $email = isset( $_POST['visibi_email'] ) ? sanitize_email( wp_unslash( $_POST['visibi_email'] ) ) : '';
    $phone = isset( $_POST['visibi_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_phone'] ) ) : '';
    $raw_url = isset( $_POST['visibi_url'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['visibi_url'] ) ) ) : '';
    $url = visibi_normalize_website_url( $raw_url );
    $need = isset( $_POST['visibi_need'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_need'] ) ) : '';
    $message = isset( $_POST['visibi_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['visibi_message'] ) ) : '';
    if ( ! $name || ! is_email( $email ) || ! $phone || ( $raw_url && ! $url ) ) { visibi_form_redirect( $return, 'error' ); }
    $rate_key = 'visibi_lead_' . md5( strtolower( $email ) . '|' . (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
    if ( (int) get_transient( $rate_key ) >= 5 ) { visibi_form_redirect( $return, 'rate' ); }
    set_transient( $rate_key, (int) get_transient( $rate_key ) + 1, HOUR_IN_SECONDS );
    $body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nWebsite: {$url}\nNeed: {$need}\nSource: {$return}\n\n{$message}";
    $lead_id = wp_insert_post( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'post_title' => 'Enquiry from ' . $name, 'post_content' => $body ), true );
    if ( is_wp_error( $lead_id ) ) { visibi_form_redirect( $return, 'error' ); }
    $mail_sent = wp_mail( get_option( 'admin_email' ), 'New VISIBI enquiry', $body, array( 'Reply-To: ' . $email ) );
    update_post_meta( $lead_id, '_visibi_email_status', $mail_sent ? 'sent' : 'failed' );
    visibi_form_redirect( $return, $mail_sent ? 'sent' : 'stored' );
    exit;
}
add_action( 'admin_post_visibi_lead', 'visibi_handle_lead' );
add_action( 'admin_post_nopriv_visibi_lead', 'visibi_handle_lead' );

/** The exported markup contains a form placeholder that WordPress expands at render time. */
add_filter( 'the_content', function ( $content ) {
    if ( ! str_contains( $content, '<div data-visibi-form="1"></div>' ) ) { return $content; }
    return str_replace( '<div data-visibi-form="1"></div>', do_shortcode( '[visibi_lead_form]' ), $content );
}, 20 );
