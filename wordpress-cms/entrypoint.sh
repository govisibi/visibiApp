#!/bin/sh
set -eu

a2dismod -f mpm_event mpm_worker >/dev/null
a2enmod mpm_prefork >/dev/null

mkdir -p /var/www/html/wp-content/themes /var/www/html/wp-content/mu-plugins
mkdir -p /var/www/html/wp-content/themes/visibi
cp -a /opt/visibi/theme/. /var/www/html/wp-content/themes/visibi/
cp -a /opt/visibi/mu-plugins/. /var/www/html/wp-content/mu-plugins/
cp /opt/visibi/root-config.php /var/www/html/wp-config.php
cp /opt/visibi/root.htaccess /var/www/html/.htaccess
cp /opt/visibi/root-robots.txt /var/www/html/robots.txt
rm -f /var/www/html/wp-content/mu-plugins/visibi-v2-robots.php
chown -R www-data:www-data /var/www/html/wp-content/themes/visibi /var/www/html/wp-content/mu-plugins
chown www-data:www-data /var/www/html/wp-config.php /var/www/html/.htaccess /var/www/html/robots.txt

if [ -n "${WORDPRESS_DB_HOST:-}${WORDPRESS_DB_HOST_FILE:-}" ]; then
  su -s /bin/sh www-data -c 'php /opt/visibi/import-team-photos.php'
  su -s /bin/sh www-data -c 'php /opt/visibi/cleanup-legacy-root.php'
  remove_legacy_dir() {
    case "$1" in
      /var/www/html/v2|/var/www/html/wp-content/themes/visibi-react|/var/www/html/wp-content/plugins/visibi-content|/var/www/html/wp-content/plugins/contact-form-7|/var/www/html/wp-content/uploads/wpcf7_uploads) ;;
      *) echo "Refusing unexpected cleanup path: $1" >&2; exit 1 ;;
    esac
    if [ -e "$1" ] || [ -L "$1" ]; then
      if [ -L "$1" ] || [ "$(readlink -f "$1")" != "$1" ]; then
        echo "Refusing noncanonical cleanup path: $1" >&2
        exit 1
      fi
      rm -rf -- "$1"
    fi
  }
  remove_legacy_dir /var/www/html/v2
  remove_legacy_dir /var/www/html/wp-content/themes/visibi-react
  remove_legacy_dir /var/www/html/wp-content/plugins/visibi-content
  remove_legacy_dir /var/www/html/wp-content/plugins/contact-form-7
  remove_legacy_dir /var/www/html/wp-content/uploads/wpcf7_uploads
fi

exec docker-entrypoint.sh "$@"
