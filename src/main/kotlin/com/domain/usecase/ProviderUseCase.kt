package com.domain.usecase

import com.data.repository.DatabaseVideoGameRepository
import com.domain.models.UpdateVideoGame
import com.domain.models.VideoGame


import org.slf4j.Logger
import org.slf4j.LoggerFactory

object ProviderUseCase {

    private val repository = DatabaseVideoGameRepository()  //me creo el repositorio con todos los datos. Lo hago una sola vez.
    val logger: Logger = LoggerFactory.getLogger("VideoGameUseCaseLogger")

    //Aquí tengo todos los casos de uso.
    private val getAllVideoGamesUseCase = GetAllVideoGamesUseCase(repository)
    private val getVideoGameByIdUseCase = GetVideoGameByIdUseCase(repository)
    private val updateVideoGameUseCase = UpdateVideoGameUseCase(repository)
    private val insertVideoGameUseCase = InsertVideoGameUseCase(repository)
    private val getVideoGamesByPlataformaUseCase = GetVideoGamesByPlataformaUseCase(repository)
    private val deleteVideoGameUseCase = DeleteVideoGameUseCase(repository)



    fun getAllVideoGames() = getAllVideoGamesUseCase()  //Lo invoco, como si fuera una funcion.



    fun getVideoGameById(id: Int?): VideoGame? {
        if (id == null) {
            logger.warn("El id esta vacio. No podemos buscar un videojuego")
            return null
        }
        getVideoGameByIdUseCase.id = id
        val videoGame = getVideoGameByIdUseCase()
        return if (videoGame == null) {
            logger.warn("No se ha encontrado un videojuego con ese $id.")
            null
        } else {
            videoGame
        }
    }



    fun insertVideoGame(videoGame: VideoGame?): Int? {
        if (videoGame == null) {
            logger.warn("No existen datos del videojuego a insertar")
            return null
        }
        insertVideoGameUseCase.videoGame = videoGame
        val res = insertVideoGameUseCase()
        return if (res == null) {
            logger.warn("No se ha insertado el videojuego. Posiblemente ya exista")
            null
        } else {
            res
        }
    }

    fun updateVideoGame(updateVideoGame: UpdateVideoGame?, id: Int): Boolean {
        if (updateVideoGame == null) {
            logger.warn("No existen datos del videojuego a actualizar")
            return false
        }

        updateVideoGameUseCase.updateVideoGame = updateVideoGame
        updateVideoGameUseCase.id = id
        return updateVideoGameUseCase()
    }

    fun getVideoGamesByPlataforma(plataforma: String): List<VideoGame> {
        getVideoGamesByPlataformaUseCase.filter = plataforma
        return getVideoGamesByPlataformaUseCase()
    }

    fun deleteVideoGame(id: Int): Boolean {
        deleteVideoGameUseCase.id = id
        return deleteVideoGameUseCase()
    }

}