<?php
/** Functional forms for the exported meeting, careers and newsletter sections. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function visibi_normalize_website_url( $raw ) {
    $raw = trim( (string) $raw );
    if ( '' === $raw ) { return ''; }
    if ( strlen( $raw ) > 255 || preg_match( '/\s/', $raw ) || str_starts_with( $raw, '//' ) ) { return false; }
    if ( ! preg_match( '#^https?://#i', $raw ) ) {
        if ( preg_match( '/^[a-z][a-z0-9+.-]*:/i', $raw ) ) { return false; }
        $raw = 'https://' . $raw;
    }
    $url = esc_url_raw( $raw, array( 'http', 'https' ) );
    $parts = $url ? wp_parse_url( $url ) : false;
    if ( ! is_array( $parts ) || empty( $parts['host'] ) || ! in_array( strtolower( $parts['scheme'] ?? '' ), array( 'http', 'https' ), true ) || isset( $parts['user'] ) || isset( $parts['pass'] ) ) { return false; }
    $host = strtolower( $parts['host'] );
    $domain = ! filter_var( $host, FILTER_VALIDATE_IP ) && str_contains( $host, '.' ) && filter_var( $host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME );
    $public_ip = filter_var( $host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE );
    return $domain || $public_ip ? $url : false;
}

function visibi_form_message( $state, $kind = 'enquiry' ) {
    if ( 'sent' === $state || 'already' === $state ) {
        $message = 'newsletter' === $kind ? 'Thanks. Your subscription has been saved.' : ( 'career' === $kind ? 'Thanks. Your application has been received.' : ( 'meeting' === $kind ? 'Thanks. Your meeting request has been received. We will confirm a time by email.' : ( 'payment' === $kind ? 'Thanks. Your invoice request has been received. We will email payment instructions after checking the invoice.' : 'Thanks. Your enquiry has been received.' ) ) );
        return '<p class="visibi-form__message" role="status">' . esc_html( $message ) . '</p>';
    }
    if ( 'stored' === $state ) {
        return '<p class="visibi-form__message" role="status">' . esc_html( 'Your details were saved, but our email notification failed. Please email info@govisibi.ai if your request is urgent.' ) . '</p>';
    }
    if ( 'error' === $state ) {
        return '<p class="visibi-form__message" role="alert">' . esc_html( 'Please check the required fields and try again.' ) . '</p>';
    }
    if ( 'rate' === $state ) {
        return '<p class="visibi-form__message" role="alert">' . esc_html( 'This email has sent several requests recently. Please try again in an hour or email info@govisibi.ai.' ) . '</p>';
    }
    return '';
}

function visibi_form_redirect( $return, $state, $anchor = 'visibi-enquiry', $query_name = 'visibi_form', $detail = '' ) {
    if ( '1' === ( $_SERVER['HTTP_X_VISIBI_AJAX'] ?? '' ) ) {
        $action = isset( $_POST['action'] ) ? sanitize_key( wp_unslash( $_POST['action'] ) ) : '';
        $kinds = array( 'visibi_career' => 'career', 'visibi_meeting' => 'meeting', 'visibi_newsletter' => 'newsletter', 'visibi_payment_request' => 'payment' );
        $kind = $kinds[ $action ] ?? 'enquiry';
        $message = $detail ?: wp_strip_all_tags( visibi_form_message( $state, $kind ) );
        $data = array( 'state' => $state, 'message' => $message );
        if ( in_array( $state, array( 'sent', 'stored', 'already' ), true ) ) { wp_send_json_success( $data ); }
        wp_send_json_error( $data, 'rate' === $state ? 429 : 422 );
    }
    $return = wp_validate_redirect( $return, home_url( '/contact/' ) );
    $return = explode( '#', $return, 2 )[0];
    wp_safe_redirect( add_query_arg( $query_name, $state, $return ) . '#' . $anchor );
    exit;
}

function visibi_form_rate_limited( $kind ) {
    $key = 'visibi_form_' . md5( $kind . '|' . (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
    $count = (int) get_transient( $key );
    if ( $count >= 5 ) { return true; }
    set_transient( $key, $count + 1, HOUR_IN_SECONDS );
    return false;
}

function visibi_career_form() {
    ob_start();
    $state = isset( $_GET['visibi_form'] ) ? sanitize_key( wp_unslash( $_GET['visibi_form'] ) ) : '';
    ?>
    <form id="visibi-enquiry" class="visibi-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" enctype="multipart/form-data">
      <?php echo visibi_form_message( $state, 'career' ); ?>
      <input type="hidden" name="action" value="visibi_career">
      <input type="hidden" name="visibi_return" value="<?php echo esc_url( get_permalink() ); ?>">
      <?php wp_nonce_field( 'visibi_career', 'visibi_nonce' ); ?>
      <label class="visibi-form__honeypot" aria-hidden="true">Leave this empty<input type="text" name="visibi_website_confirm" tabindex="-1" autocomplete="off"></label>
      <label>Where are you based? <select name="visibi_location" required><option>Any country</option><option>USA</option><option>Germany</option><option>UAE</option><option>Canada</option><option>Other</option></select></label>
      <label>Role <input name="visibi_role" value="General application" required maxlength="180"></label>
      <label>Full name <input name="visibi_name" autocomplete="name" required maxlength="120"></label>
      <label>Email <input type="email" name="visibi_email" autocomplete="email" required maxlength="190"></label>
      <label>Phone number <input type="tel" name="visibi_phone" autocomplete="tel" required maxlength="40"></label>
      <label>CV (PDF, DOC or DOCX, up to 5 MB) <input type="file" name="visibi_cv" accept=".pdf,.doc,.docx" required></label>
      <label>LinkedIn or portfolio link <input type="text" name="visibi_portfolio" inputmode="url" placeholder="linkedin.com/in/yourname" maxlength="255"></label>
      <label>Anything you would like us to know? <textarea name="visibi_message" rows="3" maxlength="3000"></textarea></label>
      <button class="visibi-button" type="submit">Send application &rarr;</button>
      <small>A real person reads every application.</small>
    </form>
    <?php
    return ob_get_clean();
}

function visibi_handle_career() {
    $return = isset( $_POST['visibi_return'] ) ? esc_url_raw( wp_unslash( $_POST['visibi_return'] ) ) : home_url( '/careers/' );
    $nonce = isset( $_POST['visibi_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_nonce'] ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'visibi_career' ) || ! empty( $_POST['visibi_website_confirm'] ) ) { visibi_form_redirect( $return, 'error' ); }
    $name = isset( $_POST['visibi_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_name'] ) ) : '';
    $email = isset( $_POST['visibi_email'] ) ? sanitize_email( wp_unslash( $_POST['visibi_email'] ) ) : '';
    $phone = isset( $_POST['visibi_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_phone'] ) ) : '';
    $role = isset( $_POST['visibi_role'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_role'] ) ) : '';
    $location = isset( $_POST['visibi_location'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_location'] ) ) : '';
    $message = isset( $_POST['visibi_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['visibi_message'] ) ) : '';
    $raw_portfolio = isset( $_POST['visibi_portfolio'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_portfolio'] ) ) : '';
    $portfolio = visibi_normalize_website_url( $raw_portfolio );
    $file = $_FILES['visibi_cv'] ?? null;
    $allowed = array( 'pdf' => array( 'application/pdf' ), 'doc' => array( 'application/msword', 'application/octet-stream' ), 'docx' => array( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip' ) );
    $filename = $file ? sanitize_file_name( $file['name'] ) : '';
    $extension = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
    $mime = $file && is_uploaded_file( $file['tmp_name'] ) ? ( new finfo( FILEINFO_MIME_TYPE ) )->file( $file['tmp_name'] ) : '';
    if ( ! $name || ! is_email( $email ) || ! $phone || ! $role || ! $location || ( $raw_portfolio && ! $portfolio ) || ! $file || UPLOAD_ERR_OK !== (int) $file['error'] || $file['size'] < 1 || $file['size'] > 5 * MB_IN_BYTES || ! isset( $allowed[ $extension ] ) || ! in_array( $mime, $allowed[ $extension ], true ) ) { visibi_form_redirect( $return, 'error' ); }
    if ( visibi_form_rate_limited( 'career' ) ) { visibi_form_redirect( $return, 'error' ); }
    $body = "Application from: {$name}\nEmail: {$email}\nPhone: {$phone}\nRole: {$role}\nLocation: {$location}\nPortfolio: {$portfolio}\nCV: {$filename}\nSource: {$return}\n\n{$message}";
    $lead_id = wp_insert_post( wp_slash( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'post_title' => 'Application: ' . $role . ' — ' . $name, 'post_content' => $body ) ), true );
    if ( is_wp_error( $lead_id ) ) { visibi_form_redirect( $return, 'error' ); }
    update_post_meta( $lead_id, '_visibi_cv_name', $filename );
    update_post_meta( $lead_id, '_visibi_cv_mime', $mime );
    update_post_meta( $lead_id, '_visibi_cv_data', base64_encode( file_get_contents( $file['tmp_name'] ) ) );
    $sent = wp_mail( get_option( 'admin_email' ), 'New VISIBI job application', $body, array( 'Reply-To: ' . $email ) );
    update_post_meta( $lead_id, '_visibi_email_status', $sent ? 'sent' : 'failed' );
    visibi_form_redirect( $return, $sent ? 'sent' : 'stored' );
}
add_action( 'admin_post_visibi_career', 'visibi_handle_career' );
add_action( 'admin_post_nopriv_visibi_career', 'visibi_handle_career' );

add_action( 'add_meta_boxes_visibi_lead', function ( $post ) {
    if ( ! $post || ! get_post_meta( $post->ID, '_visibi_cv_data', true ) ) { return; }
    add_meta_box( 'visibi_cv', 'Applicant CV', function ( $post ) {
        $url = wp_nonce_url( admin_url( 'admin-post.php?action=visibi_download_cv&lead=' . $post->ID ), 'visibi_cv_' . $post->ID );
        echo '<p><a class="button" href="' . esc_url( $url ) . '">Download CV</a></p>';
    }, 'visibi_lead', 'side' );
} );
add_action( 'admin_post_visibi_download_cv', function () {
    $id = isset( $_GET['lead'] ) ? absint( $_GET['lead'] ) : 0;
    if ( ! $id || ! current_user_can( 'edit_post', $id ) ) { wp_die( 'Not allowed.', '', array( 'response' => 403 ) ); }
    check_admin_referer( 'visibi_cv_' . $id );
    $data = base64_decode( (string) get_post_meta( $id, '_visibi_cv_data', true ), true );
    if ( false === $data ) { wp_die( 'CV not found.', '', array( 'response' => 404 ) ); }
    $name = sanitize_file_name( (string) get_post_meta( $id, '_visibi_cv_name', true ) );
    $mime = (string) get_post_meta( $id, '_visibi_cv_mime', true );
    nocache_headers();
    header( 'Content-Type: ' . $mime );
    header( 'Content-Disposition: attachment; filename="' . $name . '"' );
    header( 'Content-Length: ' . strlen( $data ) );
    echo $data;
    exit;
} );

function visibi_meeting_days() {
    $days = array();
    $day = new DateTimeImmutable( 'tomorrow', wp_timezone() );
    while ( count( $days ) < 5 ) {
        if ( (int) $day->format( 'N' ) < 6 ) { $days[ $day->format( 'Y-m-d' ) ] = $day->format( 'D j M Y' ); }
        $day = $day->modify( '+1 day' );
    }
    return $days;
}

function visibi_meeting_form() {
    ob_start();
    $state = isset( $_GET['visibi_form'] ) ? sanitize_key( wp_unslash( $_GET['visibi_form'] ) ) : '';
    $complete = in_array( $state, array( 'sent', 'stored' ), true );
    $meeting_days = visibi_meeting_days();
    $first_day = array_key_first( $meeting_days );
    $slots = array(
        'UK' => array( '09:00', '10:00', '11:00', '12:30', '14:00', '15:00', '16:00', '17:00' ),
        'UAE' => array( '09:00', '10:00', '11:30', '13:00', '14:30', '15:30', '16:30', '17:30' ),
        'remote' => array( '08:00', '09:00', '10:00', '11:00', '12:00', '12:30' ),
    );
    ?>
    <form id="visibi-enquiry" class="visibi-form visibi-meeting-form<?php echo $complete ? ' is-complete' : ''; ?>" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
      <?php echo visibi_form_message( $state, 'meeting' ); ?>
      <input type="hidden" name="action" value="visibi_meeting">
      <input type="hidden" name="visibi_return" value="<?php echo esc_url( get_permalink() ); ?>">
      <?php wp_nonce_field( 'visibi_meeting', 'visibi_nonce' ); ?>
      <label class="visibi-form__honeypot" aria-hidden="true">Leave this empty<input type="text" name="visibi_website_confirm" tabindex="-1" autocomplete="off"></label>
      <input type="hidden" name="visibi_timezone" value="UK time">
      <fieldset class="visibi-meeting__step">
        <legend>1. Where are you based?</legend>
        <div class="visibi-meeting__choices visibi-meeting__regions">
          <?php foreach ( array( 'UK' => 'UK', 'UAE' => 'UAE', 'USA' => 'USA', 'International' => 'INTL' ) as $value => $label ) : ?>
            <label class="visibi-meeting__choice"><input type="radio" name="visibi_region" value="<?php echo esc_attr( $value ); ?>" <?php checked( 'UK', $value ); ?> required><span><?php echo esc_html( $label ); ?></span></label>
          <?php endforeach; ?>
        </div>
      </fieldset>
      <fieldset class="visibi-meeting__step">
        <legend>2. How would you like to meet?</legend>
        <div class="visibi-meeting__choices visibi-meeting__modes">
          <?php foreach ( array( 'Video call', 'Phone', 'In person' ) as $mode ) : ?>
            <label class="visibi-meeting__choice"><input type="radio" name="visibi_mode" value="<?php echo esc_attr( $mode ); ?>" <?php checked( 'Video call', $mode ); ?> required><span><?php echo esc_html( $mode ); ?></span></label>
          <?php endforeach; ?>
        </div>
        <label class="visibi-meeting__city" hidden><span class="screen-reader-text">City or address for an in-person meeting</span><input name="visibi_city" maxlength="180" placeholder="Your city or address (e.g. Manchester)"></label>
      </fieldset>
      <fieldset class="visibi-meeting__step">
        <legend>3. Pick a day</legend>
        <div class="visibi-meeting__choices visibi-meeting__days">
          <?php foreach ( $meeting_days as $date => $label ) : $day = new DateTimeImmutable( $date, wp_timezone() ); ?>
            <label class="visibi-meeting__choice"><input type="radio" name="visibi_meeting_date" value="<?php echo esc_attr( $date ); ?>" <?php checked( $date, $first_day ); ?> required><span><small><?php echo esc_html( $day->format( 'D' ) ); ?></small><strong><?php echo esc_html( $day->format( 'j' ) ); ?></strong></span></label>
          <?php endforeach; ?>
        </div>
      </fieldset>
      <fieldset class="visibi-meeting__step">
        <legend>4. Pick a time (<span data-meeting-timezone-label>UK time</span>)</legend>
        <?php foreach ( $slots as $region => $times ) : ?>
          <div class="visibi-meeting__choices visibi-meeting__slots" data-meeting-slots="<?php echo esc_attr( $region ); ?>" <?php echo 'UK' !== $region ? 'hidden' : ''; ?>>
            <?php foreach ( $times as $time ) : ?>
              <label class="visibi-meeting__choice"><input type="radio" name="visibi_meeting_time" value="<?php echo esc_attr( $time ); ?>" required <?php disabled( 'UK' !== $region ); ?>><span><?php echo esc_html( $time ); ?></span></label>
            <?php endforeach; ?>
          </div>
        <?php endforeach; ?>
      </fieldset>
      <label class="visibi-meeting__field"><span class="screen-reader-text">Full name</span><input name="visibi_name" autocomplete="name" placeholder="Full name *" aria-label="Full name" required maxlength="120"></label>
      <label class="visibi-meeting__field"><span class="screen-reader-text">Email</span><input type="email" name="visibi_email" autocomplete="email" placeholder="Email *" aria-label="Email" required maxlength="190"></label>
      <label class="visibi-meeting__field"><span class="screen-reader-text">Phone number</span><input type="tel" inputmode="tel" name="visibi_phone" autocomplete="tel" placeholder="Phone number *" aria-label="Phone number" required maxlength="40"></label>
      <button class="visibi-button" type="submit" data-meeting-submit>Request meeting &rarr;</button>
    </form>
    <?php
    return ob_get_clean();
}

function visibi_handle_meeting() {
    $return = isset( $_POST['visibi_return'] ) ? esc_url_raw( wp_unslash( $_POST['visibi_return'] ) ) : home_url( '/about/' );
    $nonce = isset( $_POST['visibi_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_nonce'] ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'visibi_meeting' ) || ! empty( $_POST['visibi_website_confirm'] ) ) { visibi_form_redirect( $return, 'error' ); }
    $name = isset( $_POST['visibi_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_name'] ) ) : '';
    $email = isset( $_POST['visibi_email'] ) ? sanitize_email( wp_unslash( $_POST['visibi_email'] ) ) : '';
    $phone = isset( $_POST['visibi_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_phone'] ) ) : '';
    $region = isset( $_POST['visibi_region'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_region'] ) ) : '';
    $mode = isset( $_POST['visibi_mode'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_mode'] ) ) : '';
    $city = isset( $_POST['visibi_city'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_city'] ) ) : '';
    $date = isset( $_POST['visibi_meeting_date'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_meeting_date'] ) ) : '';
    $time = isset( $_POST['visibi_meeting_time'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_meeting_time'] ) ) : '';
    $timezone = isset( $_POST['visibi_timezone'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_timezone'] ) ) : '';
    $message = isset( $_POST['visibi_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['visibi_message'] ) ) : '';
    $valid_date = preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) && strtotime( $date ) > time() - DAY_IN_SECONDS && strtotime( $date ) < time() + 22 * DAY_IN_SECONDS;
    if ( ! $name || ! is_email( $email ) || ! $phone || ! in_array( $region, array( 'UK', 'UAE', 'USA', 'International' ), true ) || ! in_array( $mode, array( 'Video call', 'Phone', 'In person' ), true ) || ! $valid_date || ! preg_match( '/^\d{2}:\d{2}$/', $time ) || ! in_array( $timezone, array( 'UK time', 'UAE time', 'US Eastern time', 'Other (please specify below)' ), true ) || ( 'In person' === $mode && ( ! in_array( $region, array( 'UK', 'UAE' ), true ) || ! $city ) ) ) { visibi_form_redirect( $return, 'error' ); }
    if ( visibi_form_rate_limited( 'meeting' ) ) { visibi_form_redirect( $return, 'error' ); }
    $body = "Meeting request from: {$name}\nEmail: {$email}\nPhone: {$phone}\nRegion: {$region}\nMode: {$mode}\nCity: {$city}\nPreferred day: {$date}\nPreferred time: {$time} ({$timezone})\nSource: {$return}\n\n{$message}";
    $lead_id = wp_insert_post( wp_slash( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'post_title' => 'Meeting request: ' . $name, 'post_content' => $body ) ), true );
    if ( is_wp_error( $lead_id ) ) { visibi_form_redirect( $return, 'error' ); }
    $sent = wp_mail( get_option( 'admin_email' ), 'New VISIBI meeting request', $body, array( 'Reply-To: ' . $email ) );
    update_post_meta( $lead_id, '_visibi_email_status', $sent ? 'sent' : 'failed' );
    visibi_form_redirect( $return, $sent ? 'sent' : 'stored' );
}
add_action( 'admin_post_visibi_meeting', 'visibi_handle_meeting' );
add_action( 'admin_post_nopriv_visibi_meeting', 'visibi_handle_meeting' );

add_action( 'init', function () {
    register_post_type( 'visibi_subscriber', array( 'labels' => array( 'name' => 'Newsletter subscribers', 'singular_name' => 'Subscriber' ), 'public' => false, 'show_ui' => true, 'show_in_menu' => true, 'supports' => array( 'title' ), 'capability_type' => 'post', 'map_meta_cap' => true ) );
} );

function visibi_newsletter_section() {
    ob_start();
    $state = isset( $_GET['visibi_newsletter'] ) ? sanitize_key( wp_unslash( $_GET['visibi_newsletter'] ) ) : '';
    ?>
    <section data-screen-label="Newsletter" style="background:#f4f6fb;border-top:1px solid #e3e8f2">
      <div style="max-width:1280px;margin:0 auto;padding:clamp(32px,4.5vw,52px) clamp(20px,5vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:32px;align-items:center">
        <div style="display:flex;flex-direction:column;gap:10px"><h2 style="margin:0;font-size:clamp(26px,5vw,38px);font-weight:800;letter-spacing:-.03em;line-height:1.1">Stand out in the age of AI conversations.</h2><p style="margin:0;font-size:16px;color:#5a6680;font-weight:300">Monthly updates on AI visibility and agents. No spam.</p></div>
        <form id="visibi-newsletter" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" style="display:flex;gap:8px;background:#fff;border:1px solid #e3e8f2;border-radius:999px;padding:6px;flex-wrap:wrap">
          <input type="hidden" name="action" value="visibi_newsletter">
          <?php wp_nonce_field( 'visibi_newsletter', 'visibi_nonce' ); ?>
          <input type="text" name="visibi_website_confirm" class="visibi-form__honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">
          <input type="email" name="visibi_email" aria-label="Email for monthly updates" placeholder="Email" autocomplete="email" required maxlength="190" style="flex:3 1 180px;min-width:0;border:0;outline:none;padding:12px 18px;font-size:15px;border-radius:999px">
          <button type="submit" style="flex:1 0 auto;text-align:center;justify-content:center;background:#1d4ed8;color:#fff;border:0;border-radius:999px;padding:14px 22px;font-size:15px;font-weight:600;cursor:pointer">Subscribe &rarr;</button>
          <?php echo visibi_form_message( $state, 'newsletter' ); ?>
        </form>
      </div>
    </section>
    <?php
    return ob_get_clean();
}
add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'insights' ) || get_the_ID() !== get_queried_object_id() ) { return $content; }
    return preg_replace( '#<section\b[^>]*data-screen-label="Newsletter"[^>]*>[\s\S]*?</section>#i', visibi_newsletter_section(), $content, 1 );
}, 30 );

function visibi_handle_newsletter() {
    $return = home_url( '/insights/' );
    $nonce = isset( $_POST['visibi_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_nonce'] ) ) : '';
    $email = isset( $_POST['visibi_email'] ) ? strtolower( sanitize_email( wp_unslash( $_POST['visibi_email'] ) ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'visibi_newsletter' ) || ! empty( $_POST['visibi_website_confirm'] ) || ! is_email( $email ) ) { visibi_form_redirect( $return, 'error', 'visibi-newsletter', 'visibi_newsletter' ); }
    $existing = get_posts( array( 'post_type' => 'visibi_subscriber', 'post_status' => 'private', 'numberposts' => 1, 'meta_key' => '_visibi_subscriber_email', 'meta_value' => $email ) );
    if ( $existing ) { visibi_form_redirect( $return, 'already', 'visibi-newsletter', 'visibi_newsletter' ); }
    if ( visibi_form_rate_limited( 'newsletter' ) ) { visibi_form_redirect( $return, 'error', 'visibi-newsletter', 'visibi_newsletter' ); }
    $id = wp_insert_post( array( 'post_type' => 'visibi_subscriber', 'post_status' => 'private', 'post_title' => $email ), true );
    if ( is_wp_error( $id ) ) { visibi_form_redirect( $return, 'error', 'visibi-newsletter', 'visibi_newsletter' ); }
    update_post_meta( $id, '_visibi_subscriber_email', $email );
    $sent = wp_mail( get_option( 'admin_email' ), 'New VISIBI newsletter subscriber', "Email: {$email}\nSource: {$return}" );
    update_post_meta( $id, '_visibi_email_status', $sent ? 'sent' : 'failed' );
    visibi_form_redirect( $return, $sent ? 'sent' : 'stored', 'visibi-newsletter', 'visibi_newsletter' );
}
add_action( 'admin_post_visibi_newsletter', 'visibi_handle_newsletter' );
add_action( 'admin_post_nopriv_visibi_newsletter', 'visibi_handle_newsletter' );

function visibi_payment_request_section() {
    ob_start();
    $state = isset( $_GET['visibi_form'] ) ? sanitize_key( wp_unslash( $_GET['visibi_form'] ) ) : '';
    ?>
    <section data-screen-label="Pay invoice" style="max-width:1080px;margin:0 auto;padding:clamp(32px,5vw,56px) clamp(20px,5vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr));gap:40px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="font:500 12px 'JetBrains Mono',monospace;letter-spacing:.1em;color:#1d4ed8">CLIENT PAYMENTS</div>
        <h1 style="margin:0;font-size:clamp(32px,6vw,48px);font-weight:800;letter-spacing:-.04em;line-height:1.05">Pay an invoice</h1>
        <p style="margin:0;font-size:17px;color:#3a4661;font-weight:300;line-height:1.6">Send us your invoice details. Our accounts team will verify the invoice and email you a secure payment link or bank transfer instructions.</p>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:15px;color:#26324d"><div>✓ Your invoice is checked before payment</div><div>✓ No card details are collected on this page</div><div>✓ Your request is saved for our accounts team</div></div>
        <div style="border-top:1px solid #e3e8f2;padding-top:16px;font-size:14px;color:#5a6680;line-height:1.6">Questions about an invoice? Email <a href="mailto:accounts@govisibi.ai" style="font-weight:600">accounts@govisibi.ai</a> with your invoice number.</div>
      </div>
      <div style="background:#fff;border:1px solid #e3e8f2;border-radius:24px;padding:28px;box-shadow:0 20px 40px -24px rgba(11,21,48,.25)">
        <form id="visibi-enquiry" class="visibi-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
          <?php echo visibi_form_message( $state, 'payment' ); ?>
          <input type="hidden" name="action" value="visibi_payment_request">
          <input type="hidden" name="visibi_return" value="<?php echo esc_url( get_permalink() ); ?>">
          <?php wp_nonce_field( 'visibi_payment_request', 'visibi_nonce' ); ?>
          <label class="visibi-form__honeypot" aria-hidden="true">Leave this empty<input type="text" name="visibi_website_confirm" tabindex="-1" autocomplete="off"></label>
          <label>Invoice number <input name="visibi_invoice" placeholder="e.g. VIS-2026-0142" required maxlength="60"></label>
          <label>Amount on invoice <input type="number" name="visibi_amount" inputmode="decimal" min="0.01" step="0.01" required></label>
          <label>Currency <select name="visibi_currency" required><option value="GBP">GBP £</option><option value="USD">USD $</option><option value="AED">AED</option></select></label>
          <label>Company or name <input name="visibi_name" autocomplete="organization" required maxlength="120"></label>
          <label>Email for payment instructions <input type="email" name="visibi_email" autocomplete="email" required maxlength="190"></label>
          <label>Preferred payment method <select name="visibi_payment_method"><option value="card">Card payment link</option><option value="bank">Bank transfer instructions</option></select></label>
          <button class="visibi-button" type="submit">Request payment details &rarr;</button>
          <small>No payment is taken on this page.</small>
        </form>
      </div>
    </section>
    <?php
    return ob_get_clean();
}
add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'pay-invoice' ) || get_the_ID() !== get_queried_object_id() ) { return $content; }
    return preg_replace( '#<section\b[^>]*data-screen-label="Pay invoice"[^>]*>[\s\S]*?</section>#i', visibi_payment_request_section(), $content, 1 );
}, 30 );

function visibi_handle_payment_request() {
    $return = isset( $_POST['visibi_return'] ) ? esc_url_raw( wp_unslash( $_POST['visibi_return'] ) ) : home_url( '/pay-invoice/' );
    $nonce = isset( $_POST['visibi_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_nonce'] ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'visibi_payment_request' ) || ! empty( $_POST['visibi_website_confirm'] ) ) { visibi_form_redirect( $return, 'error' ); }
    $invoice = isset( $_POST['visibi_invoice'] ) ? strtoupper( sanitize_text_field( wp_unslash( $_POST['visibi_invoice'] ) ) ) : '';
    $raw_amount = isset( $_POST['visibi_amount'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_amount'] ) ) : '';
    $amount = is_numeric( $raw_amount ) ? (float) $raw_amount : 0;
    $currency = isset( $_POST['visibi_currency'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_currency'] ) ) : '';
    $name = isset( $_POST['visibi_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visibi_name'] ) ) : '';
    $email = isset( $_POST['visibi_email'] ) ? sanitize_email( wp_unslash( $_POST['visibi_email'] ) ) : '';
    $method = isset( $_POST['visibi_payment_method'] ) ? sanitize_key( wp_unslash( $_POST['visibi_payment_method'] ) ) : '';
    if ( ! preg_match( '/^[A-Z0-9][A-Z0-9\/-]{3,59}$/', $invoice ) || ! preg_match( '/^\d{1,9}(?:\.\d{1,2})?$/', $raw_amount ) || $amount <= 0 || $amount > 100000000 || ! in_array( $currency, array( 'GBP', 'USD', 'AED' ), true ) || ! $name || ! is_email( $email ) || ! in_array( $method, array( 'card', 'bank' ), true ) ) { visibi_form_redirect( $return, 'error' ); }
    if ( visibi_form_rate_limited( 'payment' ) ) { visibi_form_redirect( $return, 'error' ); }
    $body = "Invoice payment request\nInvoice: {$invoice}\nAmount: {$currency} " . number_format( $amount, 2, '.', ',' ) . "\nName: {$name}\nEmail: {$email}\nPreferred method: {$method}\nSource: {$return}\n\nPayment has not been taken. Verify the invoice before sending instructions.";
    $lead_id = wp_insert_post( wp_slash( array( 'post_type' => 'visibi_lead', 'post_status' => 'private', 'post_title' => 'Invoice payment request: ' . $invoice, 'post_content' => $body ) ), true );
    if ( is_wp_error( $lead_id ) ) { visibi_form_redirect( $return, 'error' ); }
    $sent = wp_mail( get_option( 'admin_email' ), 'New VISIBI invoice payment request', $body, array( 'Reply-To: ' . $email ) );
    update_post_meta( $lead_id, '_visibi_email_status', $sent ? 'sent' : 'failed' );
    visibi_form_redirect( $return, $sent ? 'sent' : 'stored' );
}
add_action( 'admin_post_visibi_payment_request', 'visibi_handle_payment_request' );
add_action( 'admin_post_nopriv_visibi_payment_request', 'visibi_handle_payment_request' );
