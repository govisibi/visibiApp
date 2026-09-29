#!/bin/sh
set -eu

# PHP runs under Apache prefork; ensure only this MPM is enabled.
a2dismod -f mpm_event mpm_worker >/dev/null
a2enmod mpm_prefork >/dev/null

for item in visibi-content visibi-react-theme; do
  case "$item" in
    visibi-content) destination=/var/www/html/wp-content/plugins/visibi-content ;;
    visibi-react-theme) destination=/var/www/html/wp-content/themes/visibi-react ;;
  esac
  mkdir -p "$(dirname "$destination")"
  rm -rf "$destination"
  cp -a "/opt/visibi/$item" "$destination"
  chown -R www-data:www-data "$destination"
done

# Preserve the approved preview files during the first root deployment for rollback.
mkdir -p /var/www/html/v2 /var/www/html/wp-content/mu-plugins
cp -a /usr/src/wordpress/. /var/www/html/v2/
cp -a /opt/visibi/v2/. /var/www/html/v2/
cp /opt/visibi/v2-robots.php /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
if [ -d /var/www/html/wp-content/plugins/wordpress-seo ]; then
  cp -a /var/www/html/wp-content/plugins/wordpress-seo /var/www/html/v2/wp-content/plugins/
fi
cp /opt/visibi/v2-config.php /var/www/html/v2/wp-config.php
chown -R www-data:www-data /var/www/html/v2 /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  rm -f /var/www/html/v2/.preview-unavailable
  if su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/install-staging.php' &&
     su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/seed-staging.php' &&
     su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/repair-permalinks.php' &&
     su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/publish-pages.php' &&
     su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/repair-footer.php' &&
     su -s /bin/sh www-data -c 'php /var/www/html/v2/_migration/reset-preview-admin.php'; then
    rm -f /var/www/html/v2/.preview-unavailable
  else
    touch /var/www/html/v2/.preview-unavailable
    chown www-data:www-data /var/www/html/v2/.preview-unavailable
    echo 'VISIBI /v2 setup failed; root site will continue and preview will return 503.' >&2
  fi
fi

# The approved v2_ content becomes the root WordPress site. Keep the old wp_
# tables and old files until the root site has been verified in production.
if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  mkdir -p /var/www/html/wp-content/themes /var/www/html/wp-content/uploads
  cp -a /opt/visibi/v2/wp-content/themes/visibi /var/www/html/wp-content/themes/
  cp -a /opt/visibi/v2/wp-content/mu-plugins/. /var/www/html/wp-content/mu-plugins/
  cp -a /var/www/html/v2/wp-content/uploads/. /var/www/html/wp-content/uploads/
  cp /opt/visibi/root-config.php /var/www/html/wp-config.php
  cp /opt/visibi/root.htaccess /var/www/html/.htaccess
  cp /opt/visibi/root-robots.txt /var/www/html/robots.txt
  rm -f /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
  chown -R www-data:www-data /var/www/html/wp-content/themes/visibi /var/www/html/wp-content/mu-plugins /var/www/html/wp-content/uploads
  chown www-data:www-data /var/www/html/wp-config.php /var/www/html/.htaccess /var/www/html/robots.txt
  su -s /bin/sh www-data -c 'php /opt/visibi/v2/_migration/promote-root.php'
fi

exec docker-entrypoint.sh "$@"
