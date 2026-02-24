# Ejemplos de Pruebas de Autenticación JWT

Este archivo contiene ejemplos prácticos para probar todos los endpoints de autenticación.

## 🧪 Guía de Pruebas

### 1. Inicializar la Base de Datos

```bash
./gradlew initDb
```

### 2. Iniciar el Servidor

```bash
./gradlew run
```

El servidor debería iniciar en `http://localhost:8080`

---

## 📋 Flujo Completo de Pruebas

### Paso 1: Registrar un Nuevo Usuario

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' | jq
```

**Respuesta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 4,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    ...
  }
}
```

💡 **Guarda el `accessToken` y `refreshToken` para los siguientes pasos**

---

### Paso 2: Login con Usuario Existente

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq
```

**O prueba con un usuario de ejemplo:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana.perez@example.com",
    "password": "password123"
  }' | jq
```

---

### Paso 3: Obtener Información del Usuario Actual

```bash
# Reemplaza <ACCESS_TOKEN> con tu token real
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl http://localhost:8080/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

---

### Paso 4: Refrescar el Access Token

```bash
# Reemplaza <REFRESH_TOKEN> con tu refresh token real
REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }" | jq
```

**Respuesta esperada:**
```json
{
  "accessToken": "nuevo_token_aqui..."
}
```

---

### Paso 5: Logout

```bash
# Reemplaza <ACCESS_TOKEN> con tu token real
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

**Respuesta esperada:**
```json
{
  "message": "Logout exitoso"
}
```

---

## ❌ Pruebas de Casos de Error

### Registro con Email Duplicado

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicado",
    "email": "ana.perez@example.com",
    "password": "password123"
  }' | jq
```

**Respuesta esperada (409):**
```json
{
  "error": "El usuario ya existe o hubo un error"
}
```

---

### Login con Credenciales Incorrectas

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrong_password"
  }' | jq
```

**Respuesta esperada (401):**
```json
{
  "error": "Credenciales invalidas"
}
```

---

### Acceder a Endpoint Protegido Sin Token

```bash
curl http://localhost:8080/me | jq
```

**Respuesta esperada (401):**
```json
{
  "error": "Token invalido o expirado"
}
```

---

### Usar Token Expirado o Inválido

```bash
curl http://localhost:8080/me \
  -H "Authorization: Bearer token_invalido" | jq
```

**Respuesta esperada (401):**
```json
{
  "error": "Token invalido o expirado"
}
```

---

## 🔄 Script de Prueba Automática

Guarda este script como `test-auth.sh` y ejecútalo:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Registrando nuevo usuario ==="
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test_'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo $REGISTER_RESPONSE | jq

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.refreshToken')

echo ""
echo "=== 2. Obteniendo información del usuario actual ==="
curl -s $BASE_URL/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo ""
echo "=== 3. Refrescando access token ==="
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

echo $REFRESH_RESPONSE | jq

NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')

echo ""
echo "=== 4. Usando nuevo access token ==="
curl -s $BASE_URL/me \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" | jq

echo ""
echo "=== 5. Haciendo logout ==="
curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" | jq

echo ""
echo "=== Prueba completada ==="
```

**Para ejecutar:**

```bash
chmod +x test-auth.sh
./test-auth.sh
```

---

## 🌐 Pruebas con Postman/Insomnia

### Configuración de Variables de Entorno

En Postman/Insomnia, configura:

- `base_url`: `http://localhost:8080`
- `access_token`: (se actualizará automáticamente)
- `refresh_token`: (se actualizará automáticamente)

### Collection de Requests

1. **Register**
   - Method: POST
   - URL: `{{base_url}}/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }
     ```

2. **Login**
   - Method: POST
   - URL: `{{base_url}}/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```

3. **Get Current User**
   - Method: GET
   - URL: `{{base_url}}/me`
   - Headers: `Authorization: Bearer {{access_token}}`

4. **Refresh Token**
   - Method: POST
   - URL: `{{base_url}}/auth/refresh`
   - Body (JSON):
     ```json
     {
       "refreshToken": "{{refresh_token}}"
     }
     ```

5. **Logout**
   - Method: POST
   - URL: `{{base_url}}/auth/logout`
   - Headers: `Authorization: Bearer {{access_token}}`

---

## 📊 Verificar en la Base de Datos

### Ver todos los usuarios

```sql
SELECT id, username, email, role, is_active, created_at, last_login_at 
FROM users;
```

### Ver usuario específico con refresh token

```sql
SELECT id, username, email, role, 
       CASE WHEN refresh_token_hash IS NOT NULL THEN 'Sí' ELSE 'No' END as tiene_refresh_token,
       last_login_at
FROM users 
WHERE email = 'test@example.com';
```

### Verificar logout (refresh token debe ser NULL)

```sql
SELECT id, username, refresh_token_hash 
FROM users 
WHERE email = 'test@example.com';
```

---

## ✅ Checklist de Funcionalidades

- [ ] Registro de usuario funciona
- [ ] Login devuelve access y refresh tokens
- [ ] Endpoint /me requiere autenticación
- [ ] Access token es válido por 15 minutos
- [ ] Refresh token genera nuevo access token
- [ ] Logout invalida el refresh token
- [ ] Passwords son hasheados con bcrypt
- [ ] Tokens JWT tienen los claims correctos
- [ ] No se puede registrar con email duplicado
- [ ] No se puede registrar con username duplicado
- [ ] Login falla con credenciales incorrectas
- [ ] Usuarios inactivos no pueden hacer login

---

## 🐛 Troubleshooting

### "Connection refused"
- Verifica que el servidor esté corriendo en el puerto 8080
- Ejecuta: `./gradlew run`

### "Token invalido o expirado"
- El access token expira en 15 minutos
- Usa el endpoint `/auth/refresh` para obtener uno nuevo

### "El usuario ya existe"
- El email o username ya está registrado
- Usa uno diferente o prueba con login

### Error de base de datos
- Verifica que MySQL esté corriendo
- Ejecuta `./gradlew initDb` para crear las tablas
- Verifica las variables de entorno de conexión
