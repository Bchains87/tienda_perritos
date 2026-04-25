# Configuración de GitHub Secrets para CI/CD

## ⚙️ Pasos para Configurar

1. **Ve a tu repositorio en GitHub**
2. **Haz clic en Settings (Configuración)**
3. **En el menú lateral, ve a: Secrets and variables → Actions**
4. **Haz clic en "New repository secret"**

---

## 📋 Secrets Requeridos

Crea estos **10 secrets** con sus respectivos valores:

### 1. **DOCKER_USERNAME**
- **Valor:** Tu usuario de Docker Hub
- **Ejemplo:** `tu_usuario_dockerhub`

### 2. **DOCKER_PASSWORD**
- **Valor:** Tu access token de Docker Hub (NO tu contraseña)
- **Cómo obtenerlo:**
  - Ve a Docker Hub → Account Settings → Security → New Access Token
  - Dale un nombre descriptivo (ej: "GitHub Actions")
  - Copia el token

### 3. **FRONTEND_HOST**
- **Valor:** IP pública de tu instancia EC2 Frontend
- **Ejemplo:** `54.123.45.67`
- **Cómo obtenerla:** AWS Console → EC2 → Instances → Elastic IP o Public IP

### 4. **BACKEND_HOST**
- **Valor:** IP privada de tu instancia EC2 Backend
- **Ejemplo:** `10.0.2.50`
- **Cómo obtenerla:** AWS Console → EC2 → Instances → Private IP

### 5. **SSH_PRIVATE_KEY**
- **Valor:** Contenido completo de `labsuser.pem`
- **Pasos:**
  1. Abre `labsuser.pem` con un editor de texto (Notepad, VSCode, etc.)
  2. Copia TODO el contenido (incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`)
  3. Pégalo como valor del secret

### 6. **DB_HOST**
- **Valor:** IP privada de tu instancia RDS o servidor BD en EC2
- **Ejemplo:** `10.0.10.120`
- **Cómo obtenerla:** 
  - Si usas RDS: AWS Console → RDS → Instances → Endpoint
  - Si es un servidor en EC2: IP privada del servidor BD
- **Nota:** Es la IP interna (privada) de tu base de datos PostgreSQL

### 7. **DB_USER**
- **Valor:** `alumno`
- **Nota:** Debe coincidir con el usuario PostgreSQL en docker-compose.yml

### 7. **DB_USER**
- **Valor:** `alumno`
- **Nota:** Debe coincidir con el usuario PostgreSQL en docker-compose.yml

### 8. **DB_PASSWORD**
- **Valor:** `alumno123`
- **Nota:** Debe coincidir con la contraseña PostgreSQL en docker-compose.yml

### 8. **DB_PASSWORD**
- **Valor:** `alumno123`
- **Nota:** Debe coincidir con la contraseña PostgreSQL en docker-compose.yml

### 9. **DB_NAME**
- **Valor:** `tienda_perritos`
- **Nota:** Es el nombre de la base de datos

### 9. **DB_NAME**
- **Valor:** `tienda_perritos`
- **Nota:** Es el nombre de la base de datos

### 10. **DB_PORT**
- **Valor:** `5432`
- **Nota:** Puerto por defecto de PostgreSQL

---

## ✅ Verificación

Una vez creados todos los secrets, puedes verificar que estén correctos:

```bash
# En tu máquina local, después de hacer push a rama 'deploy':
git log --oneline -1  # Ver el commit

# Luego ve a GitHub → Actions y verifica que el workflow corra sin errores
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**
- Los secrets **NO aparecen** en los logs del workflow
- GitHub los oculta automáticamente con `***`
- Son solo accesibles por el workflow, no por usuarios
- Puedes rotarlos en cualquier momento

---

## 🐛 Troubleshooting

### Si el workflow falla con "SSH key rejected":
- Asegúrate que la clave privada sea la completa (BEGIN-END)
- Verifica que tengas permisos en las instancias EC2

### Si Docker push falla:
- Verifica DOCKER_USERNAME y DOCKER_PASSWORD
- El token de Docker debe tener permisos de escritura

### Si la BD no conecta en EC2:
- Verifica que DB_HOST sea la IP correcta de tu RDS/BD en EC2
- Revisa que el security group permita puerto 5432
