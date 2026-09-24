FROM node:22-alpine AS react-build
WORKDIR /source
COPY frontend/package.json frontend/package-lock.json frontend/
RUN npm --prefix frontend ci
COPY frontend/ frontend/
COPY wordpress-cms/visibi-react-theme/ wordpress-cms/visibi-react-theme/
RUN npm --prefix frontend run build:wordpress

FROM wordpress:php8.3-apache
COPY wordpress-cms/visibi-content/ /opt/visibi/visibi-content/
COPY wordpress-cms/visibi-react-theme/ /opt/visibi/visibi-react-theme/
COPY --from=react-build /source/wordpress-cms/visibi-react-theme/dist/ /opt/visibi/visibi-react-theme/dist/
COPY wordpress-cms/entrypoint.sh /usr/local/bin/visibi-entrypoint
RUN chmod 755 /usr/local/bin/visibi-entrypoint
ENTRYPOINT ["/usr/local/bin/visibi-entrypoint"]
CMD ["apache2-foreground"]
