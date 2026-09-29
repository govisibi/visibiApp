<?php
/**
 * Plugin Name: Govisibi v2 crawler block
 * Description: Excludes the preview from the domain-root virtual robots.txt.
 */
if (!defined('ABSPATH')) { exit; }
add_filter('robots_txt', function ($text) {
    if (strpos($text, 'Disallow: /v2/') === false) {
        $text .= "\nUser-agent: *\nDisallow: /v2/\n";
    }
    return $text;
}, 99);
