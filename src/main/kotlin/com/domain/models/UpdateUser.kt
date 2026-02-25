package com.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUser(
    val username: String? = null,
    val email: String? = null,
    val passwordHash: String? = null,
    val avatar_url: String? = null,
    val role: String? = null
)
