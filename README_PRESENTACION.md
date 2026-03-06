# Basic API Ktor + React Frontend

Este proyecto es una aplicación fullstack que utiliza Ktor (Kotlin) para el backend y React para el frontend. Está diseñado como ejemplo educativo para la gestión de usuarios y videojuegos, incluyendo autenticación JWT y roles de usuario.

## Estructura del Proyecto

- **Backend (Ktor)**: API RESTful desarrollada en Kotlin usando Ktor. Incluye endpoints para autenticación, gestión de usuarios y videojuegos.
- **Frontend (React)**: Aplicación SPA creada con React y Vite. Permite a los usuarios registrarse, iniciar sesión, gestionar su perfil y visualizar videojuegos.
- **Docker**: Archivos Dockerfile y docker-compose para facilitar el despliegue y pruebas locales.
- **Tests**: Pruebas automáticas para el backend y scripts de prueba con curl.

## Características Principales

- Autenticación y autorización con JWT
- Gestión de usuarios (CRUD, roles: admin/user)
- Gestión de videojuegos
- Interfaz web moderna y responsiva
- Contenedores Docker para backend y frontend

## Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio
```bash
git clone <URL-del-repositorio>
cd basic-api-ktor
```

### 2. Backend (Ktor)
- Requisitos: JDK 17+, Gradle
- Ejecutar:
```bash
./gradlew run
```
- El backend estará disponible en `http://localhost:8080`

### 3. Frontend (React)
- Requisitos: Node.js 18+
- Instalar dependencias y ejecutar:
```bash
cd react
npm install
npm run dev
```
- El frontend estará disponible en `http://localhost:5173`

### 4. Docker (opcional)
- Para levantar todo con Docker Compose:
```bash
cd stack
docker-compose up --build
```

## Endpoints Principales (Backend)
- `/api/auth/login` - Login de usuario
- `/api/auth/register` - Registro de usuario
- `/api/users` - Gestión de usuarios (admin)
- `/api/videogames` - Gestión de videojuegos

## Pruebas
- Pruebas automáticas: `./gradlew test`
- Pruebas manuales: ver archivos `curl-tests.md` y `curl-tests-auth.md`

## Autores y Créditos
- Proyecto realizado por [Tu Nombre] para la asignatura de PSP (DAM2)

## Recursos útiles
- [Documentación Ktor](https://ktor.io/)
- [React](https://react.dev/)
- [Docker](https://docs.docker.com/)

---

> **Consejo para la presentación:**
> - Explica la arquitectura general (backend, frontend, contenedores)
> - Haz una demo de login, registro y gestión de usuarios/videojuegos
> - Muestra el uso de roles y la protección de rutas
> - Comenta la facilidad de despliegue con Docker
> - Resalta la seguridad con JWT
