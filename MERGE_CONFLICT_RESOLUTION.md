# 🔀 Resolución de Merge Conflicts - Tienda Perritos

## Resumen
Se resolvieron todos los conflictos de merge en `.github/workflows/deploy.yml` combinando lo mejor de ambas ramas con enfoque en **seguridad y confiabilidad**.

---

## Conflicto Encontrado

### Archivo: `.github/workflows/deploy.yml`
**Ubicación:** Líneas 67-100 (sección `deploy-backend`)

### Contexto
- **HEAD**: Mi rama con cambios de seguridad (usando secrets)
- **a348d04...**: Rama con mejoras de robustez (puertos explícitos y restart policies)

---

## Análisis del Conflicto

### ❌ HEAD (Mi versión)
```yaml
deploy-backend:
  script: |
    sudo docker run -d --name tienda-backend -p 3001:3001 \
      -e DB_HOST=10.0.10.120 \
      -e DB_USER=${{ secrets.DB_USER }} \
      -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \
      -e DB_NAME=${{ secrets.DB_NAME }} \
      -e DB_PORT=${{ secrets.DB_PORT }} \
```

**Ventajas:**
- ✅ Usa secrets para credenciales (seguro)
- ✅ Configuración flexible

**Desventajas:**
- ❌ DB_HOST hardcodeado (`10.0.10.120`)
- ❌ Sin `port` y `proxy_port` explícitos
- ❌ Sin `--restart unless-stopped`

---

### ❌ Rama a348d04... (Versión alternativa)
```yaml
deploy-backend:
  port: 22
  proxy_host: ${{ secrets.FRONTEND_HOST }}
  proxy_port: 22
  script: |
    sudo docker run -d \
      --name tienda-backend \
      -p 3001:3001 \
      --restart unless-stopped \
      -e DB_HOST=${{ secrets.DB_HOST }} \
      -e DB_USER=alumno \
      -e DB_PASSWORD=alumno123 \
```

**Ventajas:**
- ✅ Puertos explícitos (`port: 22`, `proxy_port: 22`)
- ✅ Política de reinicio automático (`--restart unless-stopped`)
- ✅ DB_HOST como secret

**Desventajas:**
- ❌ Credenciales hardcodeadas (`alumno/alumno123`) = **INSEGURO**
- ❌ Valores específicos en lugar de configurables

---

## ✅ Resolución Final (MERGED)

```yaml
deploy-backend:
  needs: build-and-push
  runs-on: ubuntu-latest
  steps:
    - name: Actualizar EC2 Backend vía proxy Frontend
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.BACKEND_HOST }}
        username: ec2-user
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        port: 22                                    # ✅ De rama a348d04
        proxy_host: ${{ secrets.FRONTEND_HOST }}
        proxy_username: ec2-user
        proxy_key: ${{ secrets.SSH_PRIVATE_KEY }}
        proxy_port: 22                              # ✅ De rama a348d04
        script: |
          sudo docker pull ${{ secrets.DOCKER_USERNAME }}/tienda-backend:latest
          sudo docker rm -f tienda-backend || true
          sudo docker run -d \
            --name tienda-backend \
            -p 3001:3001 \
            --restart unless-stopped \              # ✅ De rama a348d04
            -e DB_HOST=${{ secrets.DB_HOST }} \     # ✅ De rama a348d04
            -e DB_USER=${{ secrets.DB_USER }} \     # ✅ De HEAD (seguro)
            -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \ # ✅ De HEAD (seguro)
            -e DB_NAME=${{ secrets.DB_NAME }} \     # ✅ De HEAD (seguro)
            -e DB_PORT=${{ secrets.DB_PORT }} \     # ✅ De HEAD (seguro)
            ${{ secrets.DOCKER_USERNAME }}/tienda-backend:latest
```

---

## 🎯 Decisiones Tomadas

| Aspecto | Decisión | Razón |
|--------|----------|-------|
| **port: 22** | ✅ Incluir | Puerto SSH explícito (mejor práctica) |
| **proxy_port: 22** | ✅ Incluir | Puerto proxy explícito (consistencia) |
| **--restart unless-stopped** | ✅ Incluir | Contenedor se reinicia automáticamente |
| **DB_HOST** | ✅ Como secret | Flexible, no hardcodeado |
| **DB_USER** | ✅ Como secret | **SEGURIDAD: No hardcodear credenciales** |
| **DB_PASSWORD** | ✅ Como secret | **SEGURIDAD: No hardcodear contraseñas** |
| **DB_NAME** | ✅ Como secret | Flexible, configurable por ambiente |
| **DB_PORT** | ✅ Como secret | Configurable, no hardcodeado |

---

## 📋 Checklist de Validación

- ✅ **Seguridad:** Todas las credenciales son secrets, no hardcodeadas
- ✅ **Robustez:** Puertos explícitos (`port`, `proxy_port`)
- ✅ **Disponibilidad:** Política de reinicio (`--restart unless-stopped`)
- ✅ **Flexibilidad:** Toda configuración via secrets
- ✅ **Sintaxis:** YAML válido, sin errores
- ✅ **Consistencia:** Coincide con `deploy-frontend` (mismo patrón)

---

## 🚀 Secrets Requeridos

Para que el pipeline funcione, necesitas estos secrets en GitHub:

```
✅ DOCKER_USERNAME
✅ DOCKER_PASSWORD
✅ FRONTEND_HOST
✅ BACKEND_HOST
✅ SSH_PRIVATE_KEY
✅ DB_HOST          ← Nuevo (antes hardcodeado)
✅ DB_USER
✅ DB_PASSWORD
✅ DB_NAME
✅ DB_PORT
```

📖 Ver `CONFIGURACION_GITHUB_SECRETS.md` para instrucciones detalladas.

---

## 📝 Cambios Resumidos

| Línea | Antes | Después | Cambio |
|-------|-------|---------|--------|
| 67 | (no existe) | `port: 22` | Agregar puerto SSH explícito |
| 71 | (no existe) | `proxy_port: 22` | Agregar puerto proxy explícito |
| 75 | `--name tienda-backend -p 3001:3001 \` | `--name tienda-backend \` `-p 3001:3001 \` `-restart unless-stopped \` | Multilinea + reinicio automático |
| 79 | `-e DB_HOST=10.0.10.120 \` | `-e DB_HOST=${{ secrets.DB_HOST }} \` | Hardcoded → Secret |
| 80 | `-e DB_USER=${{ secrets.DB_USER }} \` | `-e DB_USER=${{ secrets.DB_USER }} \` | (sin cambio) |
| 81 | `-e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \` | `-e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \` | (sin cambio) |
| 82 | `-e DB_NAME=${{ secrets.DB_NAME }} \` | `-e DB_NAME=${{ secrets.DB_NAME }} \` | (sin cambio) |
| 83 | `-e DB_PORT=${{ secrets.DB_PORT }} \` | `-e DB_PORT=${{ secrets.DB_PORT }} \` | (sin cambio) |

---

## ✨ Beneficios de la Resolución

1. **🔐 Seguridad:** Todas las credenciales ahora via secrets
2. **🔧 Robustez:** Puertos explícitos previenen problemas de conectividad
3. **🚀 Disponibilidad:** El contenedor se reinicia automáticamente si falla
4. **📦 Flexibilidad:** Toda la config es parameterizable via secrets
5. **🧪 Consistencia:** Patrón igual en `deploy-frontend` y `deploy-backend`

---

## Próximos Pasos

1. ✅ Conflicto resuelto
2. → Asegúrate que todos los 10 secrets estén configurados en GitHub
3. → Haz push a rama `deploy`
4. → Monitorea GitHub Actions para verificar que pase correctamente

---

**Status:** ✅ **Todos los conflictos resueltos**

Fecha: 2026-04-25 19:00:58 UTC
