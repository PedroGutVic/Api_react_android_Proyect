package com.domain.usecase

import com.domain.repository.VideoGameInterface

class DeleteVideoGameUseCase(val repository: VideoGameInterface) {
    var id: Int? = null

    operator fun invoke(): Boolean {
        return if (id == null) {
            false
        } else {
            repository.deleteVideoGame(id!!)
        }
    }
}
