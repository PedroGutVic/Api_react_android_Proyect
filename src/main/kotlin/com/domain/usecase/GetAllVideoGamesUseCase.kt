package com.domain.usecase

import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface

class GetAllVideoGamesUseCase(val repository: VideoGameInterface) {

    operator fun invoke(): List<VideoGame> = repository.getAllVideoGames()
}
