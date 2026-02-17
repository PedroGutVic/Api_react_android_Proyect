package com.domain.usecase

import com.domain.models.User
import com.domain.repository.UserInterface

class GetAllUsersUseCase(val repository: UserInterface) {
    operator fun invoke(): List<User> = repository.getAllUsers()
}
