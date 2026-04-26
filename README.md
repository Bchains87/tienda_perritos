# 🐶 Tienda de Alimentos para Perritos - Arquitectura de Microservicios

Este proyecto es una aplicación web para la gestión (CRUD) de un inventario de productos para mascotas. Está desarrollado bajo una arquitectura de microservicios y desplegado en la nube de AWS utilizando prácticas de DevOps, contenedorización y CI/CD.

## Arquitectura del Sistema

El sistema se compone de tres capas principales, cada una ejecutándose en su propio contenedor Docker y alojada en instancias EC2 independientes dentro de AWS:

1. **Frontend (Nginx + HTML/JS):** Interfaz de usuario servida a través de Nginx configurado con privilegios mínimos (non-root user en puerto 8080) por seguridad. Expuesto al internet público (Puerto 80).
2. **Backend (Node.js + Express):** API RESTful que procesa la lógica de negocio y se comunica con la base de datos. Se ejecuta en una subred privada.
3. **Database (PostgreSQL 15):** Motor de base de datos relacional con persistencia de datos mediante volúmenes de Docker (`Named Volumes`).

## Prácticas DevOps Implementadas

* **Contenedorización Optimizada:** Uso de `Dockerfile` con *Multi-stage builds* (para el backend) y ejecución de contenedores con usuarios no-root para maximizar la seguridad (Mínimo Privilegio).
* **Persistencia de Datos:** Implementación de volúmenes en Docker Compose para garantizar que la información de los productos no se pierda ante reinicios de la infraestructura.
* **CI/CD Automatizado:** Pipeline construido en **GitHub Actions**. Al realizar un *push* a la rama `deploy`, el sistema automáticamente:
  1. Construye las imágenes Docker.
  2. Sube las imágenes a Docker Hub.
  3. Despliega la nueva versión en las instancias EC2 mediante conexión SSH segura utilizando *GitHub Secrets*.

## 🛠️ Requisitos Previos (Desarrollo Local)

* [Docker](https://www.docker.com/) y Docker Compose instalados.
* Git.

## 💻 Ejecución en Entorno Local

Para levantar todo el ecosistema de desarrollo en tu máquina:

1. Clona este repositorio.
2. Navega a la carpeta raíz del proyecto.
3. Ejecuta el siguiente comando para levantar los servicios:
   ```bash
   docker-compose up -d
