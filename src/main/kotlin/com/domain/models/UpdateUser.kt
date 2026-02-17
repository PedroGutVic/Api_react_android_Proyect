package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUser(
    val nombre: String? = null,
    val email: String? = null,
    val passwordHash: String? = null,
    val fotoPerfilUrl: String? = null,
    val rol: String? = null
)
