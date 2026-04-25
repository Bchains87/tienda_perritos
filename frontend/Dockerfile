# ETAPA 1: Preparación
FROM alpine AS builder
WORKDIR /app
COPY index.html app.js default.conf ./

# ETAPA 2: Producción con Nginx Seguro
FROM nginx:alpine

# Rúbrica: Capas limpias y configuración de permisos para usuario no-root (nginx)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Cambiamos al usuario no-root integrado de Nginx
USER nginx

# Copiamos los archivos desde la etapa 1
COPY --from=builder /app/index.html /app/app.js /usr/share/nginx/html/
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]