package com.data.models

import com.domain.models.User

// Modelo de datos que incluye campos sensibles (para uso interno en repository)
data class UserData(
    val id: Int,
    val username: String,
    val email: String,
    val passwordHash: String,
    val role: String,
    val avatarUrl: String?,
    val isActive: Boolean,
    val refreshTokenHash: String?,
    val createdAt: String,
    val updatedAt: String,
    val lastLoginAt: String?
) {
    // Convierte el modelo de datos al modelo de dominio (sin datos sensibles)
    fun toDomain(): User {
        return User(
            id = id,
            username = username,
            email = email,
            role = role,
            avatarUrl = avatarUrl,
            isActive = isActive,
            createdAt = createdAt,
            updatedAt = updatedAt,
            lastLoginAt = lastLoginAt
        )
    }
}
