#!/bin/sh
set -eu

a2dismod -f mpm_event mpm_worker >/dev/null
a2enmod mpm_prefork >/dev/null

mkdir -p /var/www/html/wp-content/themes /var/www/html/wp-content/mu-plugins
mkdir -p /var/www/html/wp-content/themes/visibi
cp -a /opt/visibi/theme/. /var/www/html/wp-content/themes/visibi/
cp -a /opt/visibi/mu-plugins/. /var/www/html/wp-content/mu-plugins/
cp /opt/visibi/site-config.php /var/www/html/wp-config.php
cp /opt/visibi/site.htaccess /var/www/html/.htaccess
cp /opt/visibi/robots.txt /var/www/html/robots.txt
rm -f /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
chown -R www-data:www-data /var/www/html/wp-content/themes/visibi /var/www/html/wp-content/mu-plugins
chown www-data:www-data /var/www/html/wp-config.php /var/www/html/.htaccess /var/www/html/robots.txt

if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  su -s /bin/sh www-data -c 'php /opt/visibi/import-team-photos.php'
fi

exec docker-entrypoint.sh "$@"
