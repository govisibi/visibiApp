FROM wordpress:php8.3-apache

COPY src/wp-content/themes/visibi/ /opt/visibi/theme/
COPY src/wp-content/mu-plugins/ /opt/visibi/mu-plugins/
COPY src/_migration/import-team-photos.php /opt/visibi/import-team-photos.php
COPY src/deploy/site-config.php /opt/visibi/site-config.php
COPY src/deploy/.htaccess /opt/visibi/site.htaccess
COPY src/deploy/robots.txt /opt/visibi/robots.txt
COPY src/deploy/entrypoint.sh /usr/local/bin/visibi-entrypoint
RUN chmod 755 /usr/local/bin/visibi-entrypoint
ENTRYPOINT ["/usr/local/bin/visibi-entrypoint"]
CMD ["apache2-foreground"]
