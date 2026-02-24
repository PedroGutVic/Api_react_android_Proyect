package com.domain.usecase.auth

import com.data.repository.DatabaseUserRepository
import com.domain.models.*
import org.slf4j.LoggerFactory

class AuthUseCase(private val repository: DatabaseUserRepository = DatabaseUserRepository()) {
    private val logger = LoggerFactory.getLogger(AuthUseCase::class.java)

    // Registro de usuario
    fun register(registerRequest: RegisterRequest): AuthResponse? {
        try {
            // Validaciones básicas
            if (registerRequest.username.isBlank() || registerRequest.email.isBlank() || registerRequest.password.isBlank()) {
                logger.warn("Campos vacíos en registro")
                return null
            }
            
            if (registerRequest.password.length < 6) {
                logger.warn("Password muy corta")
                return null
            }

            // Verificar si el usuario ya existe
            if (repository.getUserByEmail(registerRequest.email) != null) {
                logger.warn("Email ya registrado: ${registerRequest.email}")
                return null
            }

            if (repository.getUserByUsername(registerRequest.username) != null) {
                logger.warn("Username ya registrado: ${registerRequest.username}")
                return null
            }

            // Hashear password
            val passwordHash = AuthUtils.hashPassword(registerRequest.password)

            // Crear usuario
            val userId = repository.createUser(
                username = registerRequest.username,
                email = registerRequest.email,
                passwordHash = passwordHash,
                role = "user"
            )

            if (userId == null) {
                logger.error("Error al crear usuario")
                return null
            }

            // Obtener el usuario creado
            val user = repository.getUserById(userId)
            if (user == null) {
                logger.error("Error al obtener usuario recién creado")
                return null
            }

            // Generar tokens
            val accessToken = AuthUtils.generateAccessToken(userId, user.email, user.role)
            val refreshToken = AuthUtils.generateRefreshToken(userId)

            // Guardar hash del refresh token
            val refreshTokenHash = AuthUtils.hashRefreshToken(refreshToken)
            repository.updateRefreshToken(userId, refreshTokenHash)

            logger.info("Usuario registrado exitosamente: ${user.email}")
            return AuthResponse(
                accessToken = accessToken,
                refreshToken = refreshToken,
                user = user
            )
        } catch (e: Exception) {
            logger.error("Error en registro", e)
            return null
        }
    }

    // Login de usuario
    fun login(loginRequest: LoginRequest): AuthResponse? {
        try {
            // Buscar usuario por email
            val userData = repository.getUserByEmail(loginRequest.email)
            if (userData == null) {
                logger.warn("Usuario no encontrado: ${loginRequest.email}")
                return null
            }

            // Verificar si está activo
            if (!userData.isActive) {
                logger.warn("Usuario inactivo: ${loginRequest.email}")
                return null
            }

            // Verificar password
            if (!AuthUtils.verifyPassword(loginRequest.password, userData.passwordHash)) {
                logger.warn("Password incorrecta para: ${loginRequest.email}")
                return null
            }

            // Generar tokens
            val accessToken = AuthUtils.generateAccessToken(userData.id, userData.email, userData.role)
            val refreshToken = AuthUtils.generateRefreshToken(userData.id)

            // Guardar hash del refresh token
            val refreshTokenHash = AuthUtils.hashRefreshToken(refreshToken)
            repository.updateRefreshToken(userData.id, refreshTokenHash)
            
            // Actualizar last login
            repository.updateLastLogin(userData.id)

            logger.info("Login exitoso: ${userData.email}")
            return AuthResponse(
                accessToken = accessToken,
                refreshToken = refreshToken,
                user = userData.toDomain()
            )
        } catch (e: Exception) {
            logger.error("Error en login", e)
            return null
        }
    }

    // Refresh del access token
    fun refreshAccessToken(refreshTokenRequest: RefreshTokenRequest): RefreshTokenResponse? {
        try {
            // Verificar el refresh token
            val userId = AuthUtils.verifyToken(refreshTokenRequest.refreshToken)
            if (userId == null) {
                logger.warn("Refresh token inválido")
                return null
            }

            // Verificar que el token esté en la base de datos
            val refreshTokenHash = AuthUtils.hashRefreshToken(refreshTokenRequest.refreshToken)
            val userData = repository.getUserByRefreshToken(refreshTokenHash)
            if (userData == null || userData.id != userId) {
                logger.warn("Refresh token no encontrado en DB")
                return null
            }

            // Generar nuevo access token
            val newAccessToken = AuthUtils.generateAccessToken(userData.id, userData.email, userData.role)

            logger.info("Access token refrescado para userId: $userId")
            return RefreshTokenResponse(accessToken = newAccessToken)
        } catch (e: Exception) {
            logger.error("Error refrescando token", e)
            return null
        }
    }

    // Logout
    fun logout(userId: Int): Boolean {
        return try {
            repository.updateRefreshToken(userId, null)
            logger.info("Logout exitoso para userId: $userId")
            true
        } catch (e: Exception) {
            logger.error("Error en logout", e)
            false
        }
    }

    // Obtener usuario actual
    fun getCurrentUser(userId: Int): User? {
        return try {
            repository.getUserById(userId)
        } catch (e: Exception) {
            logger.error("Error obteniendo usuario actual", e)
            null
        }
    }
}
