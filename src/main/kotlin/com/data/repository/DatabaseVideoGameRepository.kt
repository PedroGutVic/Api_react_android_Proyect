package com.data.repository

import com.domain.models.UpdateVideoGame
import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface
import org.slf4j.LoggerFactory
import java.sql.Connection
import java.sql.DriverManager
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Statement

class DatabaseVideoGameRepository : VideoGameInterface {
    private val logger = LoggerFactory.getLogger(DatabaseVideoGameRepository::class.java)

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

    private fun mapRow(resultSet: ResultSet): VideoGame {
        return VideoGame(
            id = resultSet.getInt("id"),
            nombre = resultSet.getString("nombre"),
            precio = resultSet.getDouble("precio"),
            plataforma = resultSet.getString("plataforma"),
            caracteristicas = resultSet.getString("caracteristicas")
        )
    }

    override fun getAllVideoGames(): List<VideoGame> {
        val sql = "SELECT id, nombre, precio, plataforma, caracteristicas FROM videogames"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.executeQuery().use { resultSet ->
                        val result = mutableListOf<VideoGame>()
                        while (resultSet.next()) {
                            result.add(mapRow(resultSet))
                        }
                        result
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo videojuegos", e)
            emptyList()
        }
    }

    override fun getVideoGamesByPlataforma(plataforma: String): List<VideoGame> {
        val sql = "SELECT id, nombre, precio, plataforma, caracteristicas FROM videogames WHERE plataforma = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, plataforma)
                    statement.executeQuery().use { resultSet ->
                        val result = mutableListOf<VideoGame>()
                        while (resultSet.next()) {
                            result.add(mapRow(resultSet))
                        }
                        result
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo videojuegos por plataforma", e)
            emptyList()
        }
    }

    override fun getVideoGamesByNombre(nombre: String): List<VideoGame> {
        val sql = "SELECT id, nombre, precio, plataforma, caracteristicas FROM videogames WHERE nombre = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, nombre)
                    statement.executeQuery().use { resultSet ->
                        val result = mutableListOf<VideoGame>()
                        while (resultSet.next()) {
                            result.add(mapRow(resultSet))
                        }
                        result
                    }
                }
            }
        } catch (e: SQLException) {
            logger.error("Error leyendo videojuegos por nombre", e)
            emptyList()
        }
    }

    override fun getVideoGameById(id: Int): VideoGame? {
        val sql = "SELECT id, nombre, precio, plataforma, caracteristicas FROM videogames WHERE id = ?"
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
            logger.error("Error leyendo videojuego por id", e)
            null
        }
    }

    override fun postVideoGame(videoGame: VideoGame): Int? {
        val sql = """
            INSERT INTO videogames (nombre, precio, plataforma, caracteristicas)
            VALUES (?, ?, ?, ?)
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS).use { statement ->
                    statement.setString(1, videoGame.nombre)
                    statement.setDouble(2, videoGame.precio)
                    statement.setString(3, videoGame.plataforma)
                    statement.setString(4, videoGame.caracteristicas)
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
            logger.error("Error insertando videojuego", e)
            null
        }
    }

    override fun updateVideoGame(videoGame: UpdateVideoGame, id: Int): Boolean {
        val existing = getVideoGameById(id) ?: return false
        val updated = existing.copy(
            nombre = videoGame.nombre ?: existing.nombre,
            precio = videoGame.precio ?: existing.precio,
            plataforma = videoGame.plataforma ?: existing.plataforma,
            caracteristicas = videoGame.caracteristicas ?: existing.caracteristicas
        )
        val sql = """
            UPDATE videogames
            SET nombre = ?, precio = ?, plataforma = ?, caracteristicas = ?
            WHERE id = ?
        """.trimIndent()
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setString(1, updated.nombre)
                    statement.setDouble(2, updated.precio)
                    statement.setString(3, updated.plataforma)
                    statement.setString(4, updated.caracteristicas)
                    statement.setInt(5, id)
                    statement.executeUpdate() > 0
                }
            }
        } catch (e: SQLException) {
            logger.error("Error actualizando videojuego", e)
            false
        }
    }

    override fun deleteVideoGame(id: Int): Boolean {
        val sql = "DELETE FROM videogames WHERE id = ?"
        return try {
            getConnection().use { connection ->
                connection.prepareStatement(sql).use { statement ->
                    statement.setInt(1, id)
                    statement.executeUpdate() > 0
                }
            }
        } catch (e: SQLException) {
            logger.error("Error borrando videojuego", e)
            false
        }
    }
}
