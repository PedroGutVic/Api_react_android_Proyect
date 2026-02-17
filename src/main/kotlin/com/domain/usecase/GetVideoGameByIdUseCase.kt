package com.domain.usecase

import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface

class GetVideoGameByIdUseCase(val repository: VideoGameInterface) {
    var id: Int? = null

    operator fun invoke(): VideoGame? {
        return id?.let { repository.getVideoGameById(it) }
    }
}
