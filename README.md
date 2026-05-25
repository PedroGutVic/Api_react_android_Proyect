# Arcadia Vault

Catálogo de videojuegos con API REST, interfaz web React y app Android. Diseñado para desplegarse en una Raspberry Pi con Docker, expuesto públicamente mediante ngrok y nginx.

---

## Arquitectura

```
Internet
   │
  ngrok
   │
 nginx
   │
 Ktor (puerto 8080)  ──►  MySQL 8 (Docker)
   │
React (build estático servido por Ktor)
```

El backend Ktor sirve tanto la API REST como el build estático del frontend React. En desarrollo el frontend corre en Vite con proxy hacia el backend.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Ktor (Kotlin) + JWT |
| Frontend | React + Vite + Axios |
| Base de datos | MySQL 8.4 |
| Contenedores | Docker + Docker Compose |
| Exposición pública | ngrok + nginx |
| Destino de deploy | Raspberry Pi (arm64) |

---

## Estructura del proyecto

```
.
├── src/                        # Backend Ktor (Kotlin)
│   └── main/kotlin/com/
│       ├── data/
│       │   ├── models/         # Modelos de datos (BD)
│       │   └── repository/     # Implementaciones de repositorio
│       ├── domain/
│       │   ├── models/         # Modelos de dominio y DTOs
│       │   ├── repository/     # Interfaces de repositorio
│       │   └── usecase/        # Casos de uso
│       └── ktor/
│           ├── Application.kt
│           ├── Authentication.kt
│           ├── Routing.kt
│           └── Serialization.kt
├── react/                      # Frontend React + Vite
│   ├── src/
│   │   ├── api/                # Clientes Axios (auth.js, client.js)
│   │   ├── components/         # Componentes reutilizables
│   │   └── pages/              # Páginas de la app
│   ├── .env                    # Variables locales (no se sube al repo)
│   └── .env.example            # Plantilla de variables
├── stack/                      # Infraestructura Docker
│   ├── docker-compose.yml
│   ├── schema.sql              # Esquema inicial de la BD
│   ├── .env                    # Variables del compose
│   └── .env.example
└── Dockerfile                  # Build multistage (React + Ktor)
```

---

## API REST

Base URL: `http://localhost:8080`

### Autenticación (sin JWT)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login, devuelve access y refresh token |
| POST | `/auth/refresh` | Renueva el access token |
| POST | `/auth/logout` | Cierra sesión (requiere JWT) |

### Perfil (requiere JWT)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/me` | Datos del usuario autenticado |

### Videojuegos (requiere JWT)

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/videogame` | Lista todos los videojuegos | user / admin |
| GET | `/api/videogame?plataforma=PC` | Filtra por plataforma | user / admin |
| GET | `/api/videogame/{id}` | Obtiene un videojuego por ID | user / admin |
| POST | `/api/videogame/{id}/visit` | Incrementa visitas en 1 | user / admin |
| POST | `/api/videogame` | Crea un videojuego | admin |
| PATCH | `/api/videogame/{id}` | Actualiza un videojuego | admin |
| DELETE | `/api/videogame/{id}` | Elimina un videojuego | admin |

### Usuarios (requiere JWT)

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/users` | Lista todos los usuarios | admin |
| GET | `/api/users/{id}` | Obtiene un usuario por ID | admin |
| POST | `/api/users` | Crea un usuario | admin |
| PATCH | `/api/users/{id}` | Actualiza un usuario | admin / propietario |
| DELETE | `/api/users/{id}` | Elimina un usuario | admin |

---

## Base de datos

Tablas principales:

**videogames** — `id`, `nombre`, `precio`, `plataforma`, `caracteristicas`, `puntuacion`, `visitas`

**users** — `id`, `username`, `email`, `password_hash`, `role`, `avatar_url`, `is_active`, `refresh_token_hash`, `created_at`, `updated_at`, `last_login_at`

El esquema inicial con datos de ejemplo está en `stack/schema.sql`. Se ejecuta automáticamente al levantar el contenedor de MySQL por primera vez.

Usuarios de ejemplo (contraseña: `password123`):

| Usuario | Email | Rol |
|---|---|---|
| luis_admin | luis.garcia@example.com | admin |
| ana_perez | ana.perez@example.com | user |
| marta_lopez | marta.lopez@example.com | user |

---

## Puesta en marcha

### Requisitos

- Docker y Docker Compose
- Node.js 20+ (solo para desarrollo frontend)
- JDK 17+ (solo para desarrollo backend)

### Desarrollo local

**Backend:**
```bash
./gradlew run
```
El servidor arranca en `http://localhost:8080`.

**Frontend:**
```bash
cd react
cp .env.example .env
# Edita .env y pon la URL del backend en VITE_BACKEND_URL
npm install
npm run dev
```
La app arranca en `http://localhost:5173`.

La variable `VITE_BACKEND_URL` apunta al backend (local o ngrok de la Raspberry Pi):
```
VITE_BACKEND_URL=http://localhost:8080
# o si usas la raspi:
VITE_BACKEND_URL=https://tu-subdominio.ngrok-free.app
```

### Producción (Docker Compose)

```bash
cd stack
cp .env.example .env
# Edita .env con tu contraseña de MySQL
docker compose up -d
```

Variables del `stack/.env`:

```
MYSQL_ROOT_PASSWORD=tu_password_segura
MYSQL_HOST_PORT=33306
ADMINER_HOST_PORT=8181
APP_HOST_PORT=8080
```

Servicios que levanta:
- **app** — Ktor en el puerto configurado en `APP_HOST_PORT`
- **db** — MySQL 8.4 en `MYSQL_HOST_PORT`
- **adminer** — Panel web de BD en `ADMINER_HOST_PORT`

---

## Deploy en Raspberry Pi

### 1. Construir y subir la imagen (desde tu PC)

La imagen se construye para `amd64` y `arm64` simultáneamente:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t pedrogv/basic-api-ktor:latest --push .
```

### 2. Actualizar en la Raspberry Pi

```bash
docker compose pull
docker compose up -d
```

### 3. Exposición pública con ngrok

Instala ngrok en la Raspberry Pi y ejecuta:

```bash
ngrok http 8080
```

Copia la URL generada (`https://xxxx.ngrok-free.app`) y actualiza `VITE_BACKEND_URL` en tu `.env` local para desarrollo, o configura nginx como reverse proxy para producción.

---

## Dockerfile

El build es multistage:

1. **react-build** — Compila el frontend con Node 20
2. **build** — Compila el backend con Gradle 8.7 + JDK 17, copia el build de React como recursos estáticos
3. **stage final** — Imagen mínima con Eclipse Temurin 17 JRE

El build de React queda embebido dentro del JAR de Ktor y es servido directamente por el backend en producción.

---

## Frontend

Funcionalidades principales:

- Registro e inicio de sesión con JWT (access token + refresh token automático)
- Catálogo de videojuegos con búsqueda, filtros por plataforma y ordenamiento
- Modal de detalle al clicar cualquier juego — incrementa visitas automáticamente
- Sistema de favoritos local por usuario
- Dashboard de estadísticas (total juegos, valoración media, valor de biblioteca, más popular)
- Gestión completa de videojuegos y usuarios para administradores
- Perfil de usuario editable
- Tema claro / oscuro

---

## Seguridad

- Contraseñas hasheadas con BCrypt
- Autenticación con JWT (access token de corta duración + refresh token)
- Rutas protegidas por rol (`user` / `admin`)
- El refresh token se almacena hasheado en base de datos
- El frontend renueva el access token automáticamente ante respuestas 401
