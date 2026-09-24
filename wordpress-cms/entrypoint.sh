#!/bin/sh
set -eu

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
