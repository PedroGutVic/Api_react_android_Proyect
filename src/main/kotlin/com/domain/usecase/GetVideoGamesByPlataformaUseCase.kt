package com.domain.usecase

import com.domain.models.VideoGame
import com.domain.repository.VideoGameInterface

class GetVideoGamesByPlataformaUseCase(val repository: VideoGameInterface) {
    var filter: String? = null

    operator fun invoke(): List<VideoGame> {
        return filter?.let {
            repository.getVideoGamesByPlataforma(it)
        } ?: run {
            emptyList()
        }
    }
}
