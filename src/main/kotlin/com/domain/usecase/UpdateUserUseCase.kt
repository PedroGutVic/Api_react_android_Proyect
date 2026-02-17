package com.domain.usecase

import com.domain.models.UpdateUser
import com.domain.repository.UserInterface

class UpdateUserUseCase(val repository: UserInterface) {
    var updateUser: UpdateUser? = null
    var id: Int? = null

    operator fun invoke(): Boolean {
        return if (updateUser == null || id == null) {
            false
        } else {
            repository.updateUser(updateUser!!, id!!)
        }
    }
}
