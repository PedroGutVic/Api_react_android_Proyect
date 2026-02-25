package com.domain.usecase.auth

import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import java.util.*
import java.security.MessageDigest

object AuthUtils {
    // Estas constantes deberían venir de configuración en producción
    private val jwtSecret = System.getenv("JWT_SECRET") ?: "your-secret-key-change-in-production"
    private const val ACCESS_TOKEN_VALIDITY = 15 * 60 * 1000L // 15 minutos
    private const val REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000L // 7 días
    
    private val algorithm = Algorithm.HMAC256(jwtSecret)
    
    // Hash de password con BCrypt
    fun hashPassword(password: String): String {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }
    
    // Verificar password
    fun verifyPassword(password: String, hash: String): Boolean {
        val result = BCrypt.verifyer().verify(password.toCharArray(), hash)
        return result.verified
    }
    
    // Generar Access Token (corto)
    fun generateAccessToken(userId: Int, email: String, role: String): String {
        return JWT.create()
            .withSubject(userId.toString())
            .withClaim("email", email)
            .withClaim("role", role)
            .withClaim("type", "access")
            .withExpiresAt(Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
            .withIssuedAt(Date())
            .sign(algorithm)
    }
    
    // Generar Refresh Token (largo)
    fun generateRefreshToken(userId: Int): String {
        return JWT.create()
            .withSubject(userId.toString())
            .withClaim("type", "refresh")
            .withExpiresAt(Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
            .withIssuedAt(Date())
            .sign(algorithm)
    }
    
    // Verificar y extraer userId de un token
    fun verifyToken(token: String): Int? {
        return try {
            val verifier = JWT.require(algorithm).build()
            val jwt = verifier.verify(token)
            jwt.subject.toIntOrNull()
        } catch (e: JWTVerificationException) {
            null
        }
    }
    
    // Extraer claim de role
    fun getRole(token: String): String? {
        return try {
            val verifier = JWT.require(algorithm).build()
            val jwt = verifier.verify(token)
            jwt.getClaim("role").asString()
        } catch (e: JWTVerificationException) {
            null
        }
    }
    
    // Hash del refresh token para guardarlo en DB (usar SHA-256 en lugar de bcrypt)
    // Los JWT tokens son demasiado largos para bcrypt (límite 72 bytes)
    fun hashRefreshToken(refreshToken: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(refreshToken.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
