#!/bin/sh
set -eu

a2dismod -f mpm_event mpm_worker >/dev/null
a2enmod mpm_prefork >/dev/null

mkdir -p /var/www/html/wp-content/themes /var/www/html/wp-content/mu-plugins
mkdir -p /var/www/html/wp-content/themes/visibi
cp -a /opt/visibi/theme/. /var/www/html/wp-content/themes/visibi/
rm -f -- \
  '/var/www/html/wp-content/themes/visibi/assets/team-originals/adnan khan.png' \
  /var/www/html/wp-content/themes/visibi/assets/team/adnan-khan.png \
  /var/www/html/wp-content/themes/visibi/assets/team/teams-image.png \
  /var/www/html/wp-content/themes/visibi/assets/team-webp/adnan-khan-*.webp \
  /var/www/html/wp-content/themes/visibi/assets/team-webp/teams-image-*.webp
cp -a /opt/visibi/mu-plugins/. /var/www/html/wp-content/mu-plugins/
cp /opt/visibi/site-config.php /var/www/html/wp-config.php
if [ -n "${VISIBI_SITE_URL:-}" ]; then
  sed "s#https://govisibi.ai/#${VISIBI_SITE_URL%/}/#g" /opt/visibi/site.htaccess > /var/www/html/.htaccess
else
  cp /opt/visibi/site.htaccess /var/www/html/.htaccess
fi
cp /opt/visibi/robots.txt /var/www/html/robots.txt
rm -f /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
rm -f /var/www/html/wp-content/mu-plugins/visibi-preview.php
if [ -d /var/www/html/_migration ] && [ "$(readlink -f /var/www/html/_migration)" = /var/www/html/_migration ]; then
  rm -rf -- /var/www/html/_migration
fi
rm -f -- /var/www/html/content.json /var/www/html/production.htaccess /var/www/html/redirects.csv /var/www/html/root-robots-addition.txt /var/www/html/README.md
chown -R www-data:www-data /var/www/html/wp-content/themes/visibi /var/www/html/wp-content/mu-plugins
chown www-data:www-data /var/www/html/wp-config.php /var/www/html/.htaccess /var/www/html/robots.txt

if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  su -s /bin/sh www-data -c 'php /opt/visibi/import-team-photos.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/import-site-media.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/import-success-stories-images.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/import-service-media.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/import-ecommerce-team.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/import-contact-details.php'
  case "${VISIBI_SITE_URL:-https://govisibi.ai}" in
    https://govisibi.ai|https://govisibi.ai/)
      su -s /bin/sh www-data -c 'php /opt/visibi/import-peak-page.php'
      su -s /bin/sh www-data -c 'php /opt/visibi/import-about-page.php'
      su -s /bin/sh www-data -c 'php /opt/visibi/sync-launch-wording.php'
      su -s /bin/sh www-data -c 'php /opt/visibi/restore-exact-page-html.php'
      ;;
  esac
fi

if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  su -s /bin/sh www-data -c 'php /opt/visibi/remove-public-adnan.php'
fi

exec docker-entrypoint.sh "$@"
