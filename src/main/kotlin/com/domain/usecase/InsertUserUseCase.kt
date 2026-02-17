package com.domain.usecase

import com.domain.models.User
import com.domain.repository.UserInterface

class InsertUserUseCase(val repository: UserInterface) {
    var user: User? = null

    operator fun invoke(): Int? {
        return if (user == null) {
            null
        } else {
            repository.postUser(user!!)
        }
    }
}
