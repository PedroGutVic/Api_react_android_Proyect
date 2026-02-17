package com.domain.usecase

import com.domain.models.UpdateVideoGame
import com.domain.repository.VideoGameInterface

class UpdateVideoGameUseCase(val repository: VideoGameInterface) {
    var updateVideoGame: UpdateVideoGame? = null
    var id: Int? = null

    operator fun invoke(): Boolean {
        return if (updateVideoGame == null || id == null) {
            false
        } else {
            repository.updateVideoGame(updateVideoGame!!, id!!)
        }
    }
}
