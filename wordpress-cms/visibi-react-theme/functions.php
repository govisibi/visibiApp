<?php
if (!defined('ABSPATH')) { exit; }

add_action('after_setup_theme', function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
});

add_action('wp_enqueue_scripts', function (): void {
    $manifest_path = get_stylesheet_directory() . '/dist/.vite/manifest.json';
    if (!is_readable($manifest_path)) { return; }
    $manifest = json_decode(file_get_contents($manifest_path), true);
    $entry = $manifest['index.html'] ?? null;
    if (!is_array($entry) || empty($entry['file'])) { return; }
    $base = get_stylesheet_directory_uri() . '/dist/';
    foreach ($entry['css'] ?? [] as $index => $css) {
        wp_enqueue_style('visibi-react-' . $index, $base . $css, [], null);
    }
    wp_enqueue_script_module('visibi-react', $base . $entry['file'], [], null);
});
