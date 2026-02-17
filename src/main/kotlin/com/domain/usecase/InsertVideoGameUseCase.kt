package com.domain.usecase

import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface

class InsertVideoGameUseCase(val repository: VideoGameInterface) {

    var videoGame: VideoGame? = null

    operator fun invoke(): Int? {
        /*
        Si devuelve false, es que ya existe el videojuego.
         */
        return if (videoGame == null) {
            null
        } else {
            repository.postVideoGame(videoGame!!)
        }
    }
}
