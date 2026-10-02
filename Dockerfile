FROM wordpress:php8.3-apache

COPY src/wp-content/themes/visibi/ /opt/visibi/theme/
COPY src/wp-content/mu-plugins/ /opt/visibi/mu-plugins/
COPY src/scripts/import-team-photos.php /opt/visibi/import-team-photos.php
COPY src/scripts/import-site-media.php /opt/visibi/import-site-media.php
COPY src/scripts/import-success-stories-images.php /opt/visibi/import-success-stories-images.php
COPY src/scripts/import-service-media.php /opt/visibi/import-service-media.php
COPY src/scripts/import-ecommerce-team.php /opt/visibi/import-ecommerce-team.php
COPY src/scripts/import-peak-page.php /opt/visibi/import-peak-page.php
COPY src/content/peak-traffic-readiness.html /opt/visibi/peak-content.html
COPY src/scripts/import-about-page.php /opt/visibi/import-about-page.php
COPY src/content/about.html /opt/visibi/about-content.html
COPY src/scripts/sync-launch-wording.php /opt/visibi/sync-launch-wording.php
COPY src/scripts/restore-exact-page-html.php /opt/visibi/restore-exact-page-html.php
COPY src/deploy/site-config.php /opt/visibi/site-config.php
COPY src/deploy/.htaccess /opt/visibi/site.htaccess
COPY src/deploy/robots.txt /opt/visibi/robots.txt
COPY src/deploy/entrypoint.sh /usr/local/bin/visibi-entrypoint
RUN chmod 755 /usr/local/bin/visibi-entrypoint
ENTRYPOINT ["/usr/local/bin/visibi-entrypoint"]
CMD ["apache2-foreground"]
