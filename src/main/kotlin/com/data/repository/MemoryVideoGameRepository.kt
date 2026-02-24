package com.data.repository

import com.data.models.VideoGameData
import com.domain.models.UpdateVideoGame
import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface

/*
Marca el acceso a datos dependiendo del contrato. Sera la implementacion de acceso a Memoria.
 */
class MemoryVideoGameRepository : VideoGameInterface {

    override fun getAllVideoGames(): List<VideoGame> {
        return VideoGameData.listVideoGame
    }

    override fun getVideoGamesByPlataforma(plataforma: String): List<VideoGame> {
        return VideoGameData.listVideoGame.filter { it.plataforma == plataforma }
    }

    override fun getVideoGamesByNombre(nombre: String): List<VideoGame> {
        return VideoGameData.listVideoGame.filter { it.nombre == nombre }
    }

    override fun getVideoGameById(id: Int): VideoGame? =
        VideoGameData.listVideoGame.firstOrNull { it.id == id }

    override fun postVideoGame(videoGame: VideoGame): Int? {
        val nextId = (VideoGameData.listVideoGame.maxOfOrNull { it.id } ?: 0) + 1
        val toInsert = videoGame.copy(id = nextId)
        VideoGameData.listVideoGame.add(toInsert)
        return nextId
    }

    /*
    Buscamos el videojuego a modificar y sobreescribimos el mismo objeto con los datos modificados.
    Para ello, utilizamos el metodo copy que tiene cualquier objeto.
    Os recuerdo que el copy, vuelve a referenciar al objeto, por eso hay que sobreescribirlo en la lista.
     */
    override fun updateVideoGame(updateVideoGame: UpdateVideoGame, id: Int): Boolean {
        val index = VideoGameData.listVideoGame.indexOfFirst { it.id == id }
        return if (index != -1) {
            val originVideoGame = VideoGameData.listVideoGame[index]
            VideoGameData.listVideoGame[index] = originVideoGame.copy(
                nombre = updateVideoGame.nombre ?: originVideoGame.nombre,
                precio = updateVideoGame.precio ?: originVideoGame.precio,
                plataforma = updateVideoGame.plataforma ?: originVideoGame.plataforma,
                caracteristicas = updateVideoGame.caracteristicas ?: originVideoGame.caracteristicas,
                puntuacion = updateVideoGame.puntuacion ?: originVideoGame.puntuacion,
                visitas = updateVideoGame.visitas ?: originVideoGame.visitas
            )
            true
        } else {
            false
        }
    }

    override fun deleteVideoGame(id: Int): Boolean {
        val index = VideoGameData.listVideoGame.indexOfFirst { it.id == id }
        return if (index != -1) {
            VideoGameData.listVideoGame.removeAt(index)
            true
        } else {
            false
        }
    }
}
