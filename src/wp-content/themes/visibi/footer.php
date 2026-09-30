<?php /** Site footer. */ ?>
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__top">
      <div><h2>Not sure where to start?</h2><p>Tell us what you need — a senior specialist will recommend the right next step within 24 hours.</p></div>
      <div class="site-footer__actions"><a class="visibi-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a free audit &rarr;</a><a class="site-footer__outline" href="<?php echo esc_url( home_url( '/about/#meet' ) ); ?>">Book a meeting</a></div>
    </div>
    <div class="site-footer__main">
      <div class="site-footer__brand">
        <a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true"><circle cx="40" cy="40" r="26" fill="none" stroke="white" stroke-width="15"/><line x1="66" y1="86" x2="90" y2="62" stroke="white" stroke-width="15" stroke-linecap="round"/></svg>VISIBI</a>
        <p>AI visibility, ecommerce, cloud, security and marketing — engineered by senior specialists with 60+ years’ combined experience.</p>
        <div class="site-footer__contact"><a href="mailto:hello@govisibi.ai">hello@govisibi.ai</a><a href="<?php echo esc_url( home_url( '/about/#meet' ) ); ?>">Book a meeting →</a></div>
        <div class="site-footer__region"><span>Serving clients in</span><span>UK · UAE</span><span>Qatar · Saudi Arabia · Turkey</span><span>USA · Canada · Brazil</span><span>Denmark · France · Germany · Ireland · Italy · Netherlands · Spain</span><span>Australia · India · Singapore</span></div>
        <div class="site-footer__social"><a href="https://www.linkedin.com/company/visibi-ai/" rel="noopener" target="_blank" aria-label="LinkedIn">in</a><a href="https://x.com/VisibiAI" rel="noopener" target="_blank" aria-label="X">𝕏</a></div>
        <a class="site-footer__tools" href="<?php echo esc_url( home_url( '/tools/' ) ); ?>"><span>VISIBI TOOLS</span><strong>Radar &amp; Guard →</strong></a>
        <div class="site-footer__logins"><a href="https://radar.govisibi.ai/login">Radar login</a><span>·</span><a href="https://guard.govisibi.ai/login">Guard login</a><span>·</span><a href="https://www.linkedin.com/company/visibi-ai">LinkedIn</a><span>·</span><a href="https://x.com/VisibiAI">X</a></div>
      </div>
      <nav class="site-footer__links" aria-label="Footer navigation"><?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'fallback_cb' => 'visibi_menu_fallback', 'depth' => 2 ) ); ?></nav>
    </div>
    <div class="site-footer__bottom"><span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> VISIBI. All rights reserved.</span><span><a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>">Terms of use</a> &nbsp; <a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">Privacy policy</a> &nbsp; <a href="<?php echo esc_url( home_url( '/privacy/#cookies' ) ); ?>">Cookies</a> &nbsp; <a href="<?php echo esc_url( home_url( '/search/' ) ); ?>">Search</a> &nbsp; <a href="<?php echo esc_url( home_url( '/sitemap/' ) ); ?>">Sitemap</a></span></div>
  </div>
</footer>
<?php wp_footer(); ?>
</body></html>
