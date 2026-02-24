package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class VideoGame(
    val id: Int,
    val nombre: String,
    val precio: Double,
    val plataforma: String,
    val caracteristicas: String,
    val puntuacion: Float = 0f,
    val visitas: Long = 0L
)
