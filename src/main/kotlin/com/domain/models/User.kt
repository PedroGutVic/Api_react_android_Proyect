package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val nombre: String,
    val email: String,
    val passwordHash: String,
    val fotoPerfilUrl: String? = null,
    val rol: String = "usuario"
)
