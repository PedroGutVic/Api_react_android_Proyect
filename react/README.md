# Arcadia Vault - Frontend React

Interfaz pública para gestión de videojuegos y usuarios con autenticación JWT y sistema de rutas protegidas.

## 🚀 Características

- **Sistema Multi-Página** - Navegación con React Router (rutas separadas)
- **Autenticación JWT** - Login y registro conectado con backend Ktor
- **Rutas Protegidas** - Acceso a videojuegos solo con autenticación
- **Control de Roles** - Panel de usuarios exclusivo para administradores
- **Gestión de Videojuegos** - CRUD completo con búsqueda y filtros
- **Gestión de Usuarios** - Administración de usuarios con roles (solo admin)
- **Diseño Moderno** - UI con paleta cálida y animaciones suaves (Framer Motion)
- **Auto-refresh de Tokens** - Interceptores de Axios para renovar tokens automáticamente

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

### Variables de Entorno

- `VITE_API_BASE_URL` - URL del backend API (opcional en desarrollo, usa proxy de Vite)

## 🏃 Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173` (o 5174 si el puerto está ocupado).

## 🗺️ Estructura de Rutas

### Rutas Públicas (sin autenticación)

- `/` - Página de inicio con información del proyecto
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios

### Rutas Protegidas (requieren autenticación)

- `/videojuegos` - Gestión de videojuegos (CRUD completo)

### Rutas de Administrador (requieren rol admin)

- `/usuarios` - Gestión de usuarios y roles

### Otras Rutas

- `*` - Página 404 para rutas no encontradas

## 🔐 Sistema de Autenticación y Autorización

### Flujo de Autenticación

1. Usuario accede a `/login` o `/register`
2. Introduce credenciales y envía al backend
3. Backend valida y devuelve `accessToken`, `refreshToken` y datos del `user`
4. Tokens se guardan en `localStorage` con prefijo `arcadia_*`
5. Usuario redirigido a `/videojuegos` automáticamente

### Protección de Rutas

**ProtectedRoute**: Verifica que el usuario esté autenticado

- Si no está autenticado → Redirige a `/login`
- Si está autenticado → Permite el acceso

**AdminRoute**: Verifica autenticación + rol de administrador

- Si no está autenticado → Redirige a `/login`
- Si está autenticado pero no es admin → Redirige a `/videojuegos`
- Si es admin → Permite el acceso

### Endpoints Utilizados

- `POST /auth/register` - Registro de nuevos usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovación de access token

### Flujo JWT

1. El usuario se registra o inicia sesión
2. El backend devuelve `accessToken` y `refreshToken`
3. Los tokens se guardan en `localStorage`
4. Todas las peticiones incluyen automáticamente el `Authorization: Bearer <token>`
5. Si el access token expira (401), se renueva automáticamente con el refresh token
6. Si el refresh token falla, se cierra la sesión y redirige a login

## 🎨 Estructura del Proyecto

```plaintext
src/
├── api/
│   ├── auth.js              # Servicio de autenticación JWT
│   └── client.js            # Cliente Axios con interceptores
├── components/
│   ├── Navbar.jsx           # Barra de navegación principal
│   ├── ProtectedRoute.jsx   # HOC para rutas autenticadas
│   ├── AdminRoute.jsx       # HOC para rutas de administrador
│   ├── VideoGameList.jsx    # Componente de gestión de videojuegos
│   ├── UserManagement.jsx   # Componente de gestión de usuarios
│   └── stars.jsx            # Componente de rating con estrellas
├── pages/
│   ├── Home.jsx             # Página de inicio (pública)
│   ├── Login.jsx            # Página de inicio de sesión
│   ├── Register.jsx         # Página de registro
│   ├── VideoGames.jsx       # Página de videojuegos (protegida)
│   ├── Users.jsx            # Página de usuarios (solo admin)
│   └── NotFound.jsx         # Página 404
├── App.jsx                  # Router principal y layout
├── main.jsx                 # Entry point
└── index.css                # Estilos globales
```

## 🛠️ Tecnologías

- **React 19.2.0** - Librería UI
- **React Router DOM 7.x** - Enrutamiento y navegación
- **Vite 7.3.1** - Build tool
- **Axios 1.13.5** - Cliente HTTP
- **Framer Motion 12.34.0** - Animaciones
- **Lucide React 0.563.0** - Iconos

## 🔒 Seguridad

### Almacenamiento de Tokens

Los tokens JWT se almacenan en `localStorage` con las siguientes claves:

- `arcadia_access_token` - Token de acceso (vida corta)
- `arcadia_refresh_token` - Token de refresco (vida larga)
- `arcadia_user` - Información del usuario (nombre, email, rol)

### Protección de Componentes

```jsx
// Ruta protegida (requiere autenticación)
<Route 
  path="/videojuegos" 
  element={
    <ProtectedRoute>
      <VideoGames />
    </ProtectedRoute>
  } 
/>

// Ruta de administrador (requiere autenticación + rol admin)
<Route 
  path="/usuarios" 
  element={
    <AdminRoute>
      <Users />
    </AdminRoute>
  } 
/>
```

## 🏗️ Build

```bash
npm run build
```

Los archivos compilados se generan en `dist/`.

## 📝 Notas

- El proxy de Vite en desarrollo redirige `/api/*` al backend configurado en `vite.config.js`
- Los tokens JWT se almacenan en `localStorage` con prefijo `arcadia_*`
- La sesión persiste entre recargas de página
- El auto-refresh de tokens es transparente para el usuario
- Solo usuarios con rol `admin` pueden acceder a la gestión de usuarios
- Los usuarios sin autenticación son redirigidos automáticamente a `/login`

## 🔗 Backend

Este frontend se conecta con el backend Ktor disponible en el directorio raíz del proyecto. Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

Consulta [JWT_AUTH_README.md](../JWT_AUTH_README.md) para más información sobre los endpoints de autenticación.

