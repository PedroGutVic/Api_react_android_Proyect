package com.data.repository

import com.domain.models.UpdateUser
import com.domain.models.User
import com.domain.repository.UserInterface
import org.slf4j.LoggerFactory
import java.sql.Connection
import java.sql.DriverManager
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Statement

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

    private fun mapRow(resultSet: ResultSet): User {
        val foto = resultSet.getString("foto_perfil_url").takeIf { !resultSet.wasNull() }
        return User(
            id = resultSet.getInt("id"),
            nombre = resultSet.getString("nombre"),
            email = resultSet.getString("email"),
            passwordHash = resultSet.getString("password_hash"),
            fotoPerfilUrl = foto,
            rol = resultSet.getString("rol")
        )
    }

    override fun getAllUsers(): List<User> {
        val sql = "SELECT id, nombre, email, password_hash, foto_perfil_url, rol FROM usuarios"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.executeQuery().use { resultSet ->
                        val result = mutableListOf<User>()
                        while (resultSet.next()) {
                            result.add(mapRow(resultSet))
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
        val sql = "SELECT id, nombre, email, password_hash, foto_perfil_url, rol FROM usuarios WHERE id = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setInt(1, id)
                    statement.executeQuery().use { resultSet ->
                        if (resultSet.next()) mapRow(resultSet) else null
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo usuario por id", e)
            null
        }
    }

    override fun postUser(user: User): Int? {
        val sql = """
            INSERT INTO usuarios (nombre, email, password_hash, foto_perfil_url, rol)
            VALUES (?, ?, ?, ?, ?)
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS).use { statement ->
                    statement.setString(1, user.nombre)
                    statement.setString(2, user.email)
                    statement.setString(3, user.passwordHash)
                    statement.setString(4, user.fotoPerfilUrl)
                    statement.setString(5, user.rol)
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
            logger.error("Error insertando usuario", e)
            null
        }
    }

    override fun updateUser(user: UpdateUser, id: Int): Boolean {
        val existing = getUserById(id) ?: return false
        val updated = existing.copy(
            nombre = user.nombre ?: existing.nombre,
            email = user.email ?: existing.email,
            passwordHash = user.passwordHash ?: existing.passwordHash,
            fotoPerfilUrl = user.fotoPerfilUrl ?: existing.fotoPerfilUrl,
            rol = user.rol ?: existing.rol
        )
        val sql = """
            UPDATE usuarios
            SET nombre = ?, email = ?, password_hash = ?, foto_perfil_url = ?, rol = ?
            WHERE id = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, updated.nombre)
                    statement.setString(2, updated.email)
                    statement.setString(3, updated.passwordHash)
                    statement.setString(4, updated.fotoPerfilUrl)
                    statement.setString(5, updated.rol)
                    statement.setInt(6, id)
                    statement.executeUpdate() > 0
                }
            }
         } catch (e: SQLException) {
             logger.error("Error actualizando usuario", e)
             false
         }
    }

    override fun deleteUser(id: Int): Boolean {
        val sql = "DELETE FROM usuarios WHERE id = ?"
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
}
