FROM wordpress:php8.3-apache

COPY wordpress-cms/v2/wp-content/themes/visibi/ /opt/visibi/theme/
COPY wordpress-cms/v2/wp-content/mu-plugins/ /opt/visibi/mu-plugins/
COPY wordpress-cms/v2/_migration/cleanup-legacy-root.php /opt/visibi/cleanup-legacy-root.php
COPY wordpress-cms/v2/_migration/import-team-photos.php /opt/visibi/import-team-photos.php
COPY wordpress-cms/root-config.php /opt/visibi/root-config.php
COPY wordpress-cms/root.htaccess /opt/visibi/root.htaccess
COPY wordpress-cms/root-robots.txt /opt/visibi/root-robots.txt
COPY wordpress-cms/entrypoint.sh /usr/local/bin/visibi-entrypoint
RUN chmod 755 /usr/local/bin/visibi-entrypoint
ENTRYPOINT ["/usr/local/bin/visibi-entrypoint"]
CMD ["apache2-foreground"]
