package com.domain.usecase

import com.domain.repository.UserInterface

class DeleteUserUseCase(val repository: UserInterface) {
    var id: Int? = null

    operator fun invoke(): Boolean {
        return if (id == null) {
            false
        } else {
            repository.deleteUser(id!!)
        }
    }
}
