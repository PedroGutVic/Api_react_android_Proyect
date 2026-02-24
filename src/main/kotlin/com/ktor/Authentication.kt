package com.ktor

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*

fun Application.configureAuthentication() {
    val jwtSecret = System.getenv("JWT_SECRET") ?: "your-secret-key-change-in-production"
    val algorithm = Algorithm.HMAC256(jwtSecret)

    install(Authentication) {
        jwt("auth-jwt") {
            verifier(
                JWT.require(algorithm)
                    .build()
            )
            
            validate { credential ->
                // Validar que el token tenga los claims necesarios y sea de tipo "access"
                val userId = credential.payload.subject?.toIntOrNull()
                val email = credential.payload.getClaim("email").asString()
                val role = credential.payload.getClaim("role").asString()
                val type = credential.payload.getClaim("type").asString()
                
                if (userId != null && email != null && role != null && type == "access") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
            
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Token invalido o expirado"))
            }
        }
    }
}

// Extensión para obtener el userId del token JWT
val ApplicationCall.userId: Int?
    get() = principal<JWTPrincipal>()?.payload?.subject?.toIntOrNull()

// Extensión para obtener el email del token JWT
val ApplicationCall.userEmail: String?
    get() = principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()

// Extensión para obtener el role del token JWT
val ApplicationCall.userRole: String?
    get() = principal<JWTPrincipal>()?.payload?.getClaim("role")?.asString()
