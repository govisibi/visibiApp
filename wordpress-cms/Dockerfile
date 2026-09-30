FROM wordpress:php8.3-apache

COPY wordpress-cms/v2/wp-content/themes/visibi/ /opt/visibi/theme/
COPY wordpress-cms/v2/wp-content/mu-plugins/ /opt/visibi/mu-plugins/
COPY wordpress-cms/v2/_migration/import-team-photos.php /opt/visibi/import-team-photos.php
COPY wordpress-cms/v2/deploy/site-config.php /opt/visibi/site-config.php
COPY wordpress-cms/v2/deploy/.htaccess /opt/visibi/site.htaccess
COPY wordpress-cms/v2/deploy/robots.txt /opt/visibi/robots.txt
COPY wordpress-cms/v2/deploy/entrypoint.sh /usr/local/bin/visibi-entrypoint
RUN chmod 755 /usr/local/bin/visibi-entrypoint
ENTRYPOINT ["/usr/local/bin/visibi-entrypoint"]
CMD ["apache2-foreground"]
