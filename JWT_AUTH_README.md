# Sistema de Autenticación JWT

Este proyecto ahora incluye un sistema completo de autenticación JWT con los siguientes endpoints:

## 🔐 Endpoints de Autenticación

### 1. Registro de Usuario
**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "avatarUrl": null,
    "isActive": true,
    "createdAt": "2026-02-24T10:00:00",
    "updatedAt": "2026-02-24T10:00:00",
    "lastLoginAt": null
  }
}
```

### 2. Login
**POST** `/auth/login`

Inicia sesión con credenciales existentes.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    ...
  }
}
```

### 3. Refrescar Token
**POST** `/auth/refresh`

Obtiene un nuevo access token usando el refresh token.

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Respuesta exitosa (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 4. Logout
**POST** `/auth/logout`

Cierra sesión invalidando el refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Respuesta exitosa (200):**
```json
{
  "message": "Logout exitoso"
}
```

### 5. Obtener Usuario Actual
**GET** `/me`

Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "username": "usuario123",
  "email": "usuario@example.com",
  "role": "user",
  "avatarUrl": null,
  "isActive": true,
  "createdAt": "2026-02-24T10:00:00",
  "updatedAt": "2026-02-24T10:00:00",
  "lastLoginAt": "2026-02-24T10:30:00"
}
```

## 📋 Estructura de la Base de Datos

La tabla `users` incluye los siguientes campos:

- `id` - INT (autoincremental)
- `username` - VARCHAR(50) UNIQUE
- `email` - VARCHAR(255) UNIQUE
- `password_hash` - VARCHAR(255) (BCrypt hash)
- `role` - ENUM('user', 'admin')
- `avatar_url` - VARCHAR(500) NULL
- `is_active` - BOOLEAN
- `refresh_token_hash` - VARCHAR(255) NULL
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP
- `last_login_at` - TIMESTAMP NULL

## 🔑 Tokens JWT

### Access Token
- **Duración**: 15 minutos
- **Uso**: Acceder a endpoints protegidos
- **Claims**: userId, email, role, type="access"

### Refresh Token
- **Duración**: 7 días
- **Uso**: Obtener nuevos access tokens
- **Claims**: userId, type="refresh"

## 🛡️ Seguridad

1. **Passwords**: Hasheados con BCrypt (12 rounds)
2. **Refresh Tokens**: Hasheados en la base de datos
3. **JWT Secret**: Configurable via variable de entorno `JWT_SECRET`
4. **Soft Delete**: Los usuarios se marcan como inactivos en lugar de borrarse

## ⚙️ Configuración

### Variables de Entorno

```bash
# JWT Secret (IMPORTANTE: cambiar en producción)
JWT_SECRET=your-secret-key-change-in-production

# Base de datos
MYSQL_HOST=localhost
MYSQL_HOST_PORT=33306
MYSQL_DATABASE=basic_api_ktor
MYSQL_USER=root
MYSQL_PASSWORD=your_password
```

### Inicializar Base de Datos

```bash
./gradlew initDb
```

Este comando ejecutará el archivo `stack/schema.sql` que crea la tabla `users` con todos los campos necesarios.

## 📝 Ejemplos con cURL

### Registro
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "email": "nuevo@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123"
  }'
```

### Acceder a endpoint protegido
```bash
curl http://localhost:8080/me \
  -H "Authorization: Bearer <tu_access_token>"
```

### Refrescar token
```bash
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<tu_refresh_token>"
  }'
```

### Logout
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer <tu_access_token>"
```

## 🔒 Proteger Endpoints Existentes

Para proteger cualquier endpoint existente con JWT, simplemente envuélvelo en un bloque `authenticate`:

```kotlin
authenticate("auth-jwt") {
    get("/endpoint-protegido") {
        val userId = call.userId  // Extensión para obtener el userId del token
        val userRole = call.userRole  // Extensión para obtener el role
        
        // Tu lógica aquí
        call.respond(HttpStatusCode.OK, "Acceso autorizado")
    }
}
```

## 📦 Dependencias Agregadas

- `ktor-server-auth` - Soporte de autenticación
- `ktor-server-auth-jwt` - JWT para Ktor
- `bcrypt` (at.favre.lib) - Hashing de passwords

## 🎯 Usuarios de Ejemplo

El archivo `schema.sql` incluye 3 usuarios de ejemplo (password: "password123"):

- **ana_perez** / ana.perez@example.com (role: user)
- **luis_admin** / luis.garcia@example.com (role: admin)
- **marta_lopez** / marta.lopez@example.com (role: user)

## 🚀 Próximos Pasos

1. Cambiar `JWT_SECRET` en producción
2. Configurar HTTPS en producción
3. Implementar rate limiting
4. Agregar validación de email
5. Implementar recuperación de contraseña
6. Agregar logs de auditoría
