<?php
/**
 * Plugin Name: VISIBI FAQ
 * Description: Makes all imported FAQ answers available in HTML and interactive on click.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'wp_footer', function () {
    ?>
    <script>
    document.querySelectorAll('.visibi-content section#faq button[data-visibi-faq]').forEach(function(button) {
      button.addEventListener('click', function() {
        var section = button.closest('section#faq');
        var expand = button.getAttribute('aria-expanded') !== 'true';
        section.querySelectorAll('button[data-visibi-faq]').forEach(function(other) {
          var active = other === button && expand;
          other.setAttribute('aria-expanded', String(active));
          var panel = other.parentElement.querySelector('.visibi-faq-answer');
          if (panel) panel.hidden = !active;
          var icon = other.querySelector('span:last-child');
          if (icon) { icon.textContent = active ? '−' : '+'; icon.style.background = active ? '#1d4ed8' : '#eef2fa'; icon.style.color = active ? '#fff' : '#1d4ed8'; }
        });
      });
    });
    </script>
    <?php
}, 20 );
