<?php get_header(); ?>
<main id="main-content" class="visibi-archive">
  <h1>Page not found</h1>
  <p>That page may have moved. Search VISIBI or return to the homepage.</p>
  <?php get_search_form(); ?>
  <p><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Return home &rarr;</a></p>
</main>
<?php get_footer(); ?>
