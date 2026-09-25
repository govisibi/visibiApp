<?php
/**
 * Plugin Name: Visibi Content
 * Description: Editable copy and navigation for the Visibi React site.
 * Version: 0.1.0
 */
if (!defined('ABSPATH')) { exit; }

function visibi_manifest(): array {
    $path = __DIR__ . '/content-manifest.json';
    if (!is_readable($path)) { return []; }
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function visibi_content(): array {
    $content = [];
    foreach (visibi_manifest() as $field) {
        if (isset($field['key'], $field['default'])) {
            $content[$field['key']] = (string) $field['default'];
        }
    }
    $saved = get_option('visibi_content_overrides', []);
    if (is_array($saved)) {
        foreach ($saved as $key => $value) {
            if (array_key_exists($key, $content) && is_string($value)) {
                $content[$key] = $value;
            }
        }
    }
    return $content;
}

function visibi_menu(): array {
    $items = wp_get_nav_menu_items('Visibi Primary');
    if (!$items) { return []; }
    $by_parent = [];
    foreach ($items as $item) {
        $url = (string) $item->url;
        if (str_starts_with($url, home_url('/'))) {
            $url = (string) wp_parse_url($url, PHP_URL_PATH);
        }
        $by_parent[(int) $item->menu_item_parent][] = [
            'id' => (int) $item->ID,
            'label' => html_entity_decode($item->title, ENT_QUOTES, 'UTF-8'),
            'href' => $url,
            'description' => (string) $item->description,
        ];
    }
    $build = function (int $parent) use (&$build, $by_parent): array {
        $result = [];
        foreach ($by_parent[$parent] ?? [] as $item) {
            $item['children'] = $build($item['id']);
            unset($item['id']);
            $result[] = $item;
        }
        return $result;
    };
    return $build(0);
}

add_action('init', function (): void {
    register_nav_menus(['visibi-primary' => 'Visibi primary navigation']);
});

function visibi_contact_form(): ?array {
    if (!shortcode_exists('contact-form-7')) { return null; }
    $id = (int) get_option('visibi_contact_form_id', 0);
    if (!$id) {
        $forms = get_posts([
            'post_type' => 'wpcf7_contact_form',
            'post_status' => 'publish',
            'numberposts' => 1,
        ]);
        $id = $forms ? (int) $forms[0]->ID : 0;
    }
    if (!$id || get_post_type($id) !== 'wpcf7_contact_form') { return null; }
    return [
        'id' => $id,
        'html' => do_shortcode('[contact-form-7 id="' . $id . '"]'),
    ];
}
add_action('rest_api_init', function (): void {
    register_rest_route('visibi/v1', '/site', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => function () {
            return rest_ensure_response([
                'content' => get_option('visibi_content_overrides', []),
                'menu' => visibi_menu(),
                'contactForm' => visibi_contact_form(),
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
});

/**
 * The public site is React. Send WordPress public links to the matching route.
 * WordPress admin and REST requests do not run through template_redirect.
 */
add_action('template_redirect', function (): void {
    if (get_stylesheet() === 'visibi-react') { return; }
    $frontend = getenv('VISIBI_FRONTEND_URL');
    if (!$frontend || !in_array(wp_parse_url($frontend, PHP_URL_SCHEME), ['http', 'https'], true)) { return; }
    $request_path = (string) wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $path = '/' . trim($request_path, '/');
    if ($path === '/index.php') { $path = '/'; }
    $pages = [
        '/', '/about', '/geo', '/seo', '/ai-agents', '/insights',
        '/tool', '/how-we-work', '/contact', '/privacy-policy',
        '/terms-of-use', '/coming-soon',
    ];
    if (is_singular('post')) {
        $path = '/insights/' . get_post_field('post_name', get_queried_object_id());
    } elseif (str_starts_with($path, '/insights/')) {
        $slug = basename($path);
        if (!get_page_by_path($slug, OBJECT, 'post')) { return; }
    } elseif (!in_array($path, $pages, true)) {
        return;
    }
    $target = rtrim(esc_url_raw($frontend), '/') . $path;
    wp_redirect($target, 302, 'Visibi React frontend');
    exit;
}, 0);
add_action('admin_menu', function (): void {
    add_menu_page('Visibi Content', 'Visibi Content', 'edit_pages',
        'visibi-content', 'visibi_content_admin', 'dashicons-edit-page', 25);
});

function visibi_content_admin(): void {
    if (!current_user_can('edit_pages')) { wp_die('Not allowed.'); }
    $manifest = visibi_manifest();
    $files = array_values(array_unique(array_column($manifest, 'file')));
    sort($files);
    $selected = isset($_GET['file']) ? sanitize_text_field(wp_unslash($_GET['file'])) : 'pages/HomePage.jsx';
    if (!in_array($selected, $files, true)) { $selected = $files[0] ?? ''; }
    $content = visibi_content();
    wp_enqueue_media();
    echo '<div class="wrap"><h1>Visibi Content</h1>';
    echo '<p>Edit copy, media URLs and SEO text here. Use Posts for new articles.</p>';
    echo '<p><a class="button" href="' . esc_url(admin_url('nav-menus.php')) . '">Edit primary navigation</a></p>';
    $frontend = getenv('VISIBI_FRONTEND_URL');
    if ($frontend) {
        echo '<p><a class="button" href="' . esc_url(get_stylesheet() === 'visibi-react' ? home_url('/') : $frontend) . '" target="_blank" rel="noopener">Preview React site</a></p>';
    }
    if (isset($_GET['updated'])) { echo '<div class="notice notice-success"><p>Saved.</p></div>'; }
    echo '<form method="get" action="' . esc_url(admin_url('admin.php')) . '">';
    echo '<input type="hidden" name="page" value="visibi-content">';
    echo '<label for="visibi-file"><strong>Page or component:</strong></label> ';
    echo '<select id="visibi-file" name="file" onchange="this.form.submit()">';
    foreach ($files as $file) {
        echo '<option value="' . esc_attr($file) . '"' . selected($file, $selected, false) . '>' . esc_html($file) . '</option>';
    }
    echo '</select></form>';
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="visibi_save_content">';
    echo '<input type="hidden" name="visibi_file" value="' . esc_attr($selected) . '">';
    wp_nonce_field('visibi_save_content');
    echo '<table class="form-table">';
    foreach ($manifest as $field) {
        if (!isset($field['key']) || ($field['file'] ?? '') !== $selected) { continue; }
        $key = (string) $field['key'];
        $kind = (string) ($field['kind'] ?? 'text');
        if ($kind === 'seo' && get_stylesheet() === 'visibi-react' && defined('WPSEO_VERSION')) { continue; }
        $value = $content[$key] ?? '';
        echo '<tr><th scope="row"><label for="' . esc_attr($key) . '">' . esc_html($kind) . '</label></th><td>';
        echo '<textarea class="large-text" rows="' . (strlen($value) > 120 ? 4 : 2) . '" id="' . esc_attr($key) . '" name="visibi_content[' . esc_attr($key) . ']">' . esc_textarea($value) . '</textarea>';
        if ($kind === 'asset') {
            echo '<button type="button" class="button visibi-select-media" data-target="' . esc_attr($key) . '">Choose from Media Library</button>';
        }
        echo '<p class="description">' . esc_html($key) . '</p></td></tr>';
    }
    echo '</table>';
    submit_button('Save content');
    echo '</form></div>';
    ?>
    <script>
    document.querySelectorAll('.visibi-select-media').forEach((button) => {
        button.addEventListener('click', () => {
            const picker = wp.media({ title: 'Select image', button: { text: 'Use image' }, multiple: false });
            picker.on('select', () => {
                const image = picker.state().get('selection').first().toJSON();
                document.getElementById(button.dataset.target).value = image.url;
            });
            picker.open();
        });
    });
    </script>
    <?php
}
add_action('admin_post_visibi_save_content', function (): void {
    if (!current_user_can('edit_pages')) { wp_die('Not allowed.'); }
    check_admin_referer('visibi_save_content');
    $submitted = isset($_POST['visibi_content']) && is_array($_POST['visibi_content'])
        ? wp_unslash($_POST['visibi_content']) : [];
    $overrides = get_option('visibi_content_overrides', []);
    if (!is_array($overrides)) { $overrides = []; }
    foreach (visibi_manifest() as $field) {
        $key = (string) ($field['key'] ?? '');
        if (!$key || !isset($submitted[$key]) || !is_string($submitted[$key])) { continue; }
        $value = ($field['kind'] ?? '') === 'asset'
            ? esc_url_raw($submitted[$key])
            : sanitize_textarea_field($submitted[$key]);
        if ($value !== (string) ($field['default'] ?? '')) { $overrides[$key] = $value; }
        else { unset($overrides[$key]); }
    }
    update_option('visibi_content_overrides', $overrides, false);
    $selected = isset($_POST['visibi_file']) ? sanitize_text_field(wp_unslash($_POST['visibi_file'])) : '';
    wp_safe_redirect(admin_url('admin.php?page=visibi-content&file=' . rawurlencode($selected) . '&updated=1'));
    exit;
});

add_action('init', function (): void {
    foreach (['visibi_seo_title', 'visibi_seo_description', 'visibi_canonical', 'visibi_og_image'] as $key) {
        register_post_meta('post', $key, [
            'single' => true,
            'type' => 'string',
            'show_in_rest' => true,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
            'sanitize_callback' => in_array($key, ['visibi_canonical', 'visibi_og_image'], true) ? 'esc_url_raw' : 'sanitize_text_field',
        ]);
    }
});

add_action('add_meta_boxes', function (): void {
    if (defined('WPSEO_VERSION')) { return; }
    add_meta_box('visibi-seo', 'Visibi SEO', function ($post): void {
        wp_nonce_field('visibi_post_seo', 'visibi_post_seo_nonce');
        foreach ([
            'visibi_seo_title' => 'SEO title',
            'visibi_seo_description' => 'Meta description',
            'visibi_canonical' => 'Canonical URL',
            'visibi_og_image' => 'Social image URL',
        ] as $key => $label) {
            echo '<p><label for="' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong></label><br>';
            echo '<input class="widefat" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr(get_post_meta($post->ID, $key, true)) . '"></p>';
        }
    }, 'post');
});

add_action('save_post_post', function (int $post_id): void {
    if (!isset($_POST['visibi_post_seo_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['visibi_post_seo_nonce'])), 'visibi_post_seo')) { return; }
    if (!current_user_can('edit_post', $post_id)) { return; }
    foreach (['visibi_seo_title', 'visibi_seo_description', 'visibi_canonical', 'visibi_og_image'] as $key) {
        if (!isset($_POST[$key]) || !is_string($_POST[$key])) { continue; }
        $value = wp_unslash($_POST[$key]);
        update_post_meta($post_id, $key, in_array($key, ['visibi_canonical', 'visibi_og_image'], true) ? esc_url_raw($value) : sanitize_text_field($value));
    }
});
register_activation_hook(__FILE__, function (): void {
    if (wp_get_nav_menu_object('Visibi Primary')) { return; }
    $menu = wp_create_nav_menu('Visibi Primary');
    if (is_wp_error($menu)) { return; }
    $add = function (string $label, string $path, int $parent = 0, string $description = '') use ($menu): int {
        return (int) wp_update_nav_menu_item($menu, 0, [
            'menu-item-title' => $label,
            'menu-item-url' => $path === '#' ? '#' : home_url($path),
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => $parent,
            'menu-item-description' => $description,
        ]);
    };
    $consulting = $add('Consulting', '#');
    $add('GEO', '/geo', $consulting, 'Generative Engine Optimization for AI platforms');
    $add('SEO', '/seo', $consulting, 'Search Engine Optimization that feeds AI visibility');
    $add('AI Agents', '/ai-agents', $consulting, 'Intelligent automation');
    $platform = $add('Platform', '#');
    $add('Tool', '/tool', $platform, 'AI visibility tracking');
    $add('Insights', '/insights');
    $add('How We Work', '/how-we-work');
    $add('About', '/about');
    $add('Contact', '/contact');
    $locations = get_theme_mod('nav_menu_locations', []);
    $locations['visibi-primary'] = $menu;
    set_theme_mod('nav_menu_locations', $locations);
});