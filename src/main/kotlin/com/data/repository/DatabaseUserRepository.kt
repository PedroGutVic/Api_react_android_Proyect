package com.data.repository

import com.data.models.UserData
import com.domain.models.UpdateUser
import com.domain.models.User
import com.domain.repository.UserInterface
import org.slf4j.LoggerFactory
import java.sql.Connection
import java.sql.DriverManager
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Statement
import java.sql.Timestamp

class DatabaseUserRepository : UserInterface {
    private val logger = LoggerFactory.getLogger(DatabaseUserRepository::class.java)

    private fun getEnv(name: String): String? {
        return System.getenv(name) ?: System.getProperty(name)
    }

    private fun getConnection(): Connection {
        val host = getEnv("MYSQL_HOST") ?: "localhost"
        val port = getEnv("MYSQL_HOST_PORT") ?: "33306"
        val database = getEnv("MYSQL_DATABASE") ?: "basic_api_ktor"
        val user = getEnv("MYSQL_USER") ?: "root"
        val password = getEnv("MYSQL_PASSWORD") ?: getEnv("MYSQL_ROOT_PASSWORD") ?: ""

        val jdbcUrl = "jdbc:mysql://$host:$port/$database?useSSL=false&allowPublicKeyRetrieval=true"
        return DriverManager.getConnection(jdbcUrl, user, password)
    }

    private fun mapRowToUser(resultSet: ResultSet): User {
        val avatarUrl = resultSet.getString("avatar_url").takeIf { !resultSet.wasNull() }
        val lastLoginAt = resultSet.getString("last_login_at").takeIf { !resultSet.wasNull() }
        return User(
            id = resultSet.getInt("id"),
            username = resultSet.getString("username"),
            email = resultSet.getString("email"),
            role = resultSet.getString("role"),
            avatarUrl = avatarUrl,
            isActive = resultSet.getBoolean("is_active"),
            createdAt = resultSet.getString("created_at"),
            updatedAt = resultSet.getString("updated_at"),
            lastLoginAt = lastLoginAt
        )
    }

    private fun mapRowToUserData(resultSet: ResultSet): UserData {
        val avatarUrl = resultSet.getString("avatar_url").takeIf { !resultSet.wasNull() }
        val refreshTokenHash = resultSet.getString("refresh_token_hash").takeIf { !resultSet.wasNull() }
        val lastLoginAt = resultSet.getString("last_login_at").takeIf { !resultSet.wasNull() }
        return UserData(
            id = resultSet.getInt("id"),
            username = resultSet.getString("username"),
            email = resultSet.getString("email"),
            passwordHash = resultSet.getString("password_hash"),
            role = resultSet.getString("role"),
            avatarUrl = avatarUrl,
            isActive = resultSet.getBoolean("is_active"),
            refreshTokenHash = refreshTokenHash,
            createdAt = resultSet.getString("created_at"),
            updatedAt = resultSet.getString("updated_at"),
            lastLoginAt = lastLoginAt
        )
    }

    override fun getAllUsers(): List<User> {
        val sql = """
            SELECT id, username, email, role, avatar_url, is_active, 
                   created_at, updated_at, last_login_at 
            FROM users 
            WHERE is_active = TRUE
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.executeQuery().use { resultSet ->
                        val result = mutableListOf<User>()
                        while (resultSet.next()) {
                            result.add(mapRowToUser(resultSet))
                        }
                        result
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo usuarios", e)
            emptyList()
        }
    }

    override fun getUserById(id: Int): User? {
        val sql = """
            SELECT id, username, email, role, avatar_url, is_active, 
                   created_at, updated_at, last_login_at 
            FROM users 
            WHERE id = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setInt(1, id)
                    statement.executeQuery().use { resultSet ->
                        if (resultSet.next()) mapRowToUser(resultSet) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo usuario por id", e)
            null
        }
    }

    override fun getUserByEmail(email: String): UserData? {
        val sql = """
            SELECT id, username, email, password_hash, role, avatar_url, 
                   is_active, refresh_token_hash, created_at, updated_at, last_login_at 
            FROM users 
            WHERE email = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, email)
                    statement.executeQuery().use { resultSet ->
                        if (resultSet.next()) mapRowToUserData(resultSet) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error buscando usuario por email", e)
            null
        }
    }

    override fun getUserByUsername(username: String): UserData? {
        val sql = """
            SELECT id, username, email, password_hash, role, avatar_url, 
                   is_active, refresh_token_hash, created_at, updated_at, last_login_at 
            FROM users 
            WHERE username = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, username)
                    statement.executeQuery().use { resultSet ->
                        if (resultSet.next()) mapRowToUserData(resultSet) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error buscando usuario por username", e)
            null
        }
    }

    override fun createUser(username: String, email: String, passwordHash: String, role: String): Int? {
        val sql = """
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS).use { statement ->
                    statement.setString(1, username)
                    statement.setString(2, email)
                    statement.setString(3, passwordHash)
                    statement.setString(4, role)
                    val updated = statement.executeUpdate()
                    if (updated <= 0) {
                        return null
                    }
                    statement.generatedKeys.use { keys ->
                        if (keys.next()) keys.getInt(1) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error creando usuario", e)
            null
        }
    }

    override fun postUser(user: User): Int? {
        // Este método mantiene compatibilidad con código existente
        return createUser(user.username, user.email, "", user.role)
    }

    override fun updateUser(user: UpdateUser, id: Int): Boolean {
        val existing = getUserById(id) ?: return false
        val updated = existing.copy(
            username = user.nombre ?: existing.username, // Compatibilidad con nombre antiguo
            email = user.email ?: existing.email,
            role = user.rol ?: existing.role,
            avatarUrl = user.fotoPerfilUrl ?: existing.avatarUrl
        )
        val sql = """
            UPDATE users
            SET username = ?, email = ?, role = ?, avatar_url = ?
            WHERE id = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, updated.username)
                    statement.setString(2, updated.email)
                    statement.setString(3, updated.role)
                    statement.setString(4, updated.avatarUrl)
                    statement.setInt(5, id)
                    statement.executeUpdate() > 0
                }
            }
         } catch (e: SQLException) {
             logger.error("Error actualizando usuario", e)
             false
         }
    }

    override fun deleteUser(id: Int): Boolean {
        // Soft delete - marcamos como inactivo en lugar de borrar
        val sql = "UPDATE users SET is_active = FALSE WHERE id = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setInt(1, id)
                    statement.executeUpdate() > 0
                }
            }
        } catch (e: SQLException) {
            logger.error("Error borrando usuario", e)
            false
        }
    }

    override fun updateRefreshToken(userId: Int, refreshTokenHash: String?): Boolean {
        val sql = "UPDATE users SET refresh_token_hash = ? WHERE id = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, refreshTokenHash)
                    statement.setInt(2, userId)
                    statement.executeUpdate() > 0
                }
            }
        } catch (e: SQLException) {
            logger.error("Error actualizando refresh token", e)
            false
        }
    }

    override fun updateLastLogin(userId: Int): Boolean {
        val sql = "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setInt(1, userId)
                    statement.executeUpdate() > 0
                }
            }
        } catch (e: SQLException) {
            logger.error("Error actualizando last login", e)
            false
        }
    }

    override fun getUserByRefreshToken(refreshTokenHash: String): UserData? {
        val sql = """
            SELECT id, username, email, password_hash, role, avatar_url, 
                   is_active, refresh_token_hash, created_at, updated_at, last_login_at 
            FROM users 
            WHERE refresh_token_hash = ? AND is_active = TRUE
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, refreshTokenHash)
                    statement.executeQuery().use { resultSet ->
                        if (resultSet.next()) mapRowToUserData(resultSet) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error buscando usuario por refresh token", e)
            null
        }
    }
}
