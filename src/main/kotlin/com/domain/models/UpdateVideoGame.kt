package com.domain.models

import kotlinx.serialization.Serializable

/*
Solo para serializar en consultas patch.
 */
@Serializable
data class UpdateVideoGame(
    val nombre: String? = null,
    val precio: Double? = null,
    val plataforma: String? = null,
    val caracteristicas: String? = null
)
