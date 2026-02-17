package com.domain.repository

import com.domain.models.UpdateUser
import com.domain.models.User

interface UserInterface {
    fun getAllUsers(): List<User>

    fun getUserById(id: Int): User?

    fun postUser(user: User): Int?

    fun updateUser(user: UpdateUser, id: Int): Boolean

    fun deleteUser(id: Int): Boolean
}
