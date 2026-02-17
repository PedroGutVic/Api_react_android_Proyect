package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class VideoGame(
    val id: Int,
    val nombre: String,
    val precio: Double,
    val plataforma: String,
    val caracteristicas: String
)
