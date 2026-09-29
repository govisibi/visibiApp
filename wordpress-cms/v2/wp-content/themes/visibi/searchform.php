<form role="search" method="get" class="visibi-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label for="visibi-search-field" class="screen-reader-text">Search VISIBI</label>
  <input id="visibi-search-field" type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="Search services and guides" required>
  <button class="visibi-button" type="submit">Search &rarr;</button>
</form>
