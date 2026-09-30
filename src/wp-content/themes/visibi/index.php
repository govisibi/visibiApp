<?php get_header(); ?>
<main id="main-content" class="visibi-archive"><h1><?php echo is_search() ? 'Search results' : 'Insights'; ?></h1><div class="visibi-grid">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article class="visibi-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html( get_the_excerpt() ); ?></p><a href="<?php the_permalink(); ?>">Read guide &rarr;</a></article>
<?php endwhile; else : ?><p>No guides found.</p><?php endif; ?>
</div><?php the_posts_pagination(); ?></main>
<?php get_footer(); ?>
