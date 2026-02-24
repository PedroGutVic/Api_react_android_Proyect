package com.domain.repository

import com.data.models.UserData
import com.domain.models.UpdateUser
import com.domain.models.User

interface UserInterface {
    fun getAllUsers(): List<User>

    fun getUserById(id: Int): User?

    fun postUser(user: User): Int?

    fun updateUser(user: UpdateUser, id: Int): Boolean

    fun deleteUser(id: Int): Boolean

    // Métodos para autenticación
    fun getUserByEmail(email: String): UserData?
    
    fun getUserByUsername(username: String): UserData?
    
    fun createUser(username: String, email: String, passwordHash: String, role: String = "user"): Int?
    
    fun updateRefreshToken(userId: Int, refreshTokenHash: String?): Boolean
    
    fun updateLastLogin(userId: Int): Boolean
    
    fun getUserByRefreshToken(refreshTokenHash: String): UserData?
}
