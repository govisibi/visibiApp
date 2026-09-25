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

exec docker-entrypoint.sh "$@"
