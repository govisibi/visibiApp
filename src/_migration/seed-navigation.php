<?php
/** Seed editable WordPress menus matching SiteHeader and SiteFooter. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function visibi_seed_link( $menu_id, $entry, $ids, $parent = 0 ) {
    list( $label, $name ) = $entry;
    if ( ! isset( $ids[ $name ] ) ) { return 0; }
    if ( ! empty( $entry[3] ) ) {
        return wp_update_nav_menu_item( $menu_id, 0, array(
            'menu-item-title' => $label,
            'menu-item-url' => get_permalink( $ids[ $name ] ) . $entry[3],
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => $parent,
            'menu-item-status' => 'publish',
        ) );
    }
    return wp_update_nav_menu_item( $menu_id, 0, array(
        'menu-item-title' => $label,
        'menu-item-object-id' => $ids[ $name ],
        'menu-item-object' => 'page',
        'menu-item-type' => 'post_type',
        'menu-item-parent-id' => $parent,
        'menu-item-description' => isset( $entry[2] ) ? $entry[2] : '',
        'menu-item-status' => 'publish',
    ) );
}
function visibi_seed_grouped_menu( $name, $groups, $ids ) {
    $existing = wp_get_nav_menu_object( $name );
    if ( $existing ) { return $existing->term_id; }
    $menu_id = wp_create_nav_menu( $name );
    foreach ( $groups as $heading => $links ) {
        $parent = wp_update_nav_menu_item( $menu_id, 0, array(
            'menu-item-title' => $heading, 'menu-item-url' => '#', 'menu-item-type' => 'custom', 'menu-item-status' => 'publish',
        ) );
        foreach ( $links as $entry ) { visibi_seed_link( $menu_id, $entry, $ids, $parent ); }
    }
    return $menu_id;
}

$primary = wp_get_nav_menu_object( 'VISIBI Primary 2026' );
$primary_id = $primary ? $primary->term_id : wp_create_nav_menu( 'VISIBI Primary 2026' );
if ( ! $primary ) {
    visibi_seed_link( $primary_id, array( 'AI Visibility (GEO)', 'GEO' ), $ids );
    visibi_seed_link( $primary_id, array( 'AI Agents', 'AI Agents' ), $ids );
    wp_update_nav_menu_item( $primary_id, 0, array( 'menu-item-title' => 'Services', 'menu-item-url' => '#services', 'menu-item-type' => 'custom', 'menu-item-status' => 'publish' ) );
    foreach ( array(
        array( 'Tools', 'Tools' ), array( 'Results', 'Success Stories' ), array( 'Insights', 'Insights' ), array( 'About', 'About' ),
    ) as $entry ) { visibi_seed_link( $primary_id, $entry, $ids ); }
}

$services = array(
    'AI' => array(
        array( 'AI Visibility (GEO)', 'GEO', 'Get recommended by AI engines' ),
        array( 'AI Agents', 'AI Agents', 'Autonomous digital workers' ),
        array( 'AI consulting', 'AI Consulting', 'Strategy to shipped AI' ),
        array( 'VISIBI Radar (tool)', 'Radar', 'AI visibility tracker · 7-day trial' ),
    ),
    'Marketing' => array(
        array( 'All marketing', 'Marketing and SEO', 'Every channel' ), array( 'SEO', 'SEO Services', 'Technical & ecommerce SEO' ),
        array( 'Local SEO', 'Local SEO', 'Map pack & reviews' ), array( 'Google Ads', 'Google Ads Management', 'Search, Shopping, PMax' ),
        array( 'Microsoft Ads', 'Microsoft Ads Management', 'Bing & Copilot' ), array( 'Paid social', 'Paid Social Advertising', 'Meta, TikTok, LinkedIn' ),
        array( 'Email & SMS', 'Email and SMS Marketing', 'Klaviyo flows' ), array( 'Marketplaces', 'Marketplace Management', 'Amazon & eBay' ),
        array( 'CRO', 'Conversion Rate Optimisation', 'A/B testing' ), array( 'Content & PR', 'Content and Digital PR', 'Links & authority' ),
        array( 'Tracking setup', 'Tracking and Analytics Setup', 'GA4, GTM, feeds, tags' ),
    ),
    'Development' => array(
        array( 'All development', 'Development', 'Web, mobile & ecommerce' ), array( 'Front-end', 'React Development', 'React, Angular, Vue' ),
        array( 'Back-end & web', 'Backend Development', 'Python, Laravel, Node, PHP' ), array( 'Mobile apps', 'Mobile App Development', 'Native, cross-platform & PWA' ),
    ),
    'Ecommerce' => array(
        array( 'Ecommerce development', 'Ecommerce Agency Homepage v2', 'Build, migrate, optimise' ),
        array( 'Adobe Commerce Cloud', 'Adobe Commerce Cloud', 'Adobe-hosted enterprise' ),
        array( 'Adobe Commerce On-Prem', 'Adobe Commerce On-Prem', 'Self-hosted enterprise' ),
        array( 'Magento Open Source', 'Magento Open Source', 'Licence-free' ),
        array( 'Shopify Plus', 'Shopify Plus', 'SaaS for scaling brands' ),
        array( 'WooCommerce', 'WooCommerce', 'WordPress stores' ),
        array( 'Shopify', 'Shopify Development', 'Themes, apps, migrations' ),
        array( 'Black Friday readiness', 'Peak Traffic Readiness', 'Load testing & war room' ),
        array( 'Hyvä themes', 'Hyva Theme Development', 'Fast Magento front-ends' ),
        array( 'VISIBI Guard (tool)', 'Guard', 'Store health monitor · 7-day trial' ),
    ),
    'Cloud' => array(
        array( 'Cloud consulting', 'Cloud Consulting', 'Multi-cloud architects' ), array( 'AWS consulting', 'AWS Consulting', 'Certified AWS architects' ),
        array( 'Azure consulting', 'Azure Consulting', 'Certified Azure architects' ), array( 'Google Cloud consulting', 'Google Cloud Consulting', 'Certified GCP architects' ),
        array( 'Oracle Cloud consulting', 'Oracle Cloud Consulting', 'Certified OCI architects' ), array( 'Cloud cost optimisation', 'Cloud Cost Optimisation', 'Cut bills 20–50%' ),
        array( 'AWS cost optimisation', 'AWS Cost Optimisation', 'Savings Plans, Graviton' ), array( 'Azure cost optimisation', 'Azure Cost Optimisation', 'Reservations, Hybrid Benefit' ),
        array( 'Google Cloud cost optimisation', 'Google Cloud Cost Optimisation', 'CUDs, Spot VMs' ), array( 'Oracle Cloud cost optimisation', 'Oracle Cloud Cost Optimisation', 'Universal Credits, Ampere' ),
    ),
    'Hosting' => array(
        array( 'Black Friday readiness', 'Peak Traffic Readiness', 'Never go down on peak days' ), array( 'All hosting', 'Managed Hosting', 'Compare every plan' ),
        array( 'Web hosting', 'Web Hosting', 'Below the big-name hosts prices' ), array( 'WordPress hosting', 'WordPress Hosting', 'Below WP Engine prices' ),
        array( 'Magento hosting', 'Magento Hosting', 'Magento on AWS' ), array( 'AWS managed', 'AWS Managed Hosting', 'Custom & enterprise apps' ),
        array( 'DevOps & IaC', 'DevOps and IaC', 'Terraform, CI/CD, Docker' ), array( 'Fleet patching & jobs', 'Fleet Patching', 'Millions of hosts, safely' ),
    ),
    'Security' => array(
        array( 'Security plans', 'Website Security', 'Scanning, WAF, cleanups' ), array( 'Malware removal', 'Malware Removal', 'Hacked? Fixed today' ),
        array( 'WAF & DDoS', 'WAF and DDoS Protection', 'Cloudflare, AWS WAF' ), array( 'Spam & bots', 'Spam and Bot Protection', 'Card testing, fake sign-ups' ),
        array( 'Magento hardening', 'Magento Security Hardening', 'Adobe Commerce & PCI' ), array( 'Adobe Commerce patching', 'Adobe Commerce Cloud Patching', 'Security & quality patches' ),
        array( 'WordPress hardening', 'WordPress Security Hardening', 'WP & WooCommerce' ),
    ),
    'Consulting' => array(
        array( 'Software consulting', 'Software Consulting', 'Architecture, CTO' ), array( 'Ecommerce consulting', 'Ecommerce Consulting', 'Platform selection' ),
        array( 'DevOps consulting', 'DevOps Consulting', 'Cloud cost, CI/CD' ), array( 'Digital transformation', 'Digital Transformation', 'Automate & modernise' ),
    ),
    'Support' => array(
        array( 'Website support', 'Website Support and Maintenance', 'Updates, patches, fixes' ), array( 'Ecommerce support', 'Ecommerce Support', 'Magento, Shopify Plus' ),
        array( 'Software support', 'Software Support', 'Bespoke systems' ), array( 'Application support', 'Application Support', '24/7 with SLAs' ),
    ),
);
$services_id = visibi_seed_grouped_menu( 'VISIBI Services 2026', $services, $ids );

$footer = array(
    'AI' => array( array( 'AI visibility (GEO)', 'GEO' ), array( 'AI agents', 'AI Agents' ), array( 'AI consulting', 'AI Consulting' ), array( 'VISIBI Radar', 'Radar' ) ),
    'Marketing' => array( array( 'SEO', 'SEO Services' ), array( 'Google Ads', 'Google Ads Management' ), array( 'Paid social', 'Paid Social Advertising' ), array( 'Email & SMS', 'Email and SMS Marketing' ), array( 'Tracking setup', 'Tracking and Analytics Setup' ), array( 'All marketing →', 'Marketing and SEO' ) ),
    'Ecommerce' => array( array( 'Adobe Commerce', 'Adobe Commerce Cloud' ), array( 'Magento', 'Magento Open Source' ), array( 'Hyvä themes', 'Hyva Theme Development' ), array( 'Shopify Plus', 'Shopify Plus' ), array( 'WooCommerce', 'WooCommerce' ), array( 'VISIBI Guard', 'Guard' ), array( 'All ecommerce →', 'Ecommerce Agency Homepage v2' ) ),
    'Development' => array( array( 'Front-end', 'React Development' ), array( 'Back-end', 'Backend Development' ), array( 'Mobile apps', 'Mobile App Development' ), array( 'Shopify', 'Shopify Development' ), array( 'DevOps & IaC', 'DevOps and IaC' ), array( 'Fleet patching', 'Fleet Patching' ), array( 'All development →', 'Development' ) ),
    'Cloud' => array( array( 'Cloud consulting', 'Cloud Consulting' ), array( 'AWS', 'AWS Consulting' ), array( 'Azure', 'Azure Consulting' ), array( 'Google Cloud', 'Google Cloud Consulting' ), array( 'Oracle Cloud', 'Oracle Cloud Consulting' ), array( 'Cost optimisation', 'Cloud Cost Optimisation' ) ),
    'Hosting' => array( array( 'Web hosting', 'Web Hosting' ), array( 'WordPress hosting', 'WordPress Hosting' ), array( 'Magento hosting', 'Magento Hosting' ), array( 'AWS managed', 'AWS Managed Hosting' ), array( 'Black Friday readiness', 'Peak Traffic Readiness' ), array( 'Compare hosting →', 'Managed Hosting' ) ),
    'Security' => array( array( 'Security plans', 'Website Security' ), array( 'Malware removal', 'Malware Removal' ), array( 'WAF & DDoS', 'WAF and DDoS Protection' ), array( 'Magento hardening', 'Magento Security Hardening' ), array( 'Adobe Commerce patching', 'Adobe Commerce Cloud Patching' ), array( 'WordPress hardening', 'WordPress Security Hardening' ) ),
    'Consulting & Support' => array( array( 'Software consulting', 'Software Consulting' ), array( 'Ecommerce consulting', 'Ecommerce Consulting' ), array( 'Digital transformation', 'Digital Transformation' ), array( 'Website support', 'Website Support and Maintenance' ), array( 'Ecommerce support', 'Ecommerce Support' ), array( 'Application support', 'Application Support' ) ),
    'Company' => array( array( 'About us', 'About' ), array( 'Our team', 'About', '', '#team' ), array( 'Success stories', 'Success Stories' ), array( 'Insights & guides', 'Insights' ), array( 'Book a meeting', 'About', '', '#meet' ), array( 'Careers', 'Careers' ), array( 'Contact', 'Contact' ), array( 'Pay an invoice', 'Pay Invoice' ) ),
);
$footer_id = visibi_seed_grouped_menu( 'VISIBI Footer 2026', $footer, $ids );
set_theme_mod( 'nav_menu_locations', array( 'primary' => $primary_id, 'services' => $services_id, 'footer' => $footer_id ) );
