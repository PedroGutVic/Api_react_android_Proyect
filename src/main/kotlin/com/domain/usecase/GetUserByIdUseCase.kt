package com.domain.usecase

import com.domain.models.User
import com.domain.repository.UserInterface

class GetUserByIdUseCase(val repository: UserInterface) {
    var id: Int? = null

    operator fun invoke(): User? {
        return id?.let { repository.getUserById(it) }
    }
}
