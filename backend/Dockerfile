# ETAPA 1: Construcción y Dependencias
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de producción para mantener la capa limpia
RUN npm install --omit=dev

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