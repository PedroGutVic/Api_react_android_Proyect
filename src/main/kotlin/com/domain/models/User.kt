package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val username: String,
    val email: String,
    val role: String = "user",
    val avatarUrl: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String,
    val lastLoginAt: String? = null
)

// Modelo para registro de usuario
@Serializable
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)

// Modelo para login
@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

// Respuesta con tokens
@Serializable
data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: User
)

// Request para refresh token
@Serializable
data class RefreshTokenRequest(
    val refreshToken: String
)

// Respuesta de refresh
@Serializable
data class RefreshTokenResponse(
    val accessToken: String
)
