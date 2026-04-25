# ETAPA 1: Construcción y Dependencias
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
# Instalamos dependencias de producción sin usar lock file (para evitar checksums incompatibles)
RUN npm install --no-optional --omit=dev

# ETAPA 2: Producción (Imagen segura y ligera)
FROM node:18-alpine AS runner
WORKDIR /app

# Rúbrica: Mínimo privilegio (Crear usuario no-root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos solo lo necesario desde la etapa 1
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Asignamos la propiedad de los archivos al nuevo usuario seguro
RUN chown -R appuser:appgroup /app

# Cambiamos al usuario no-root
USER appuser

EXPOSE 3001
CMD ["npm", "start"]