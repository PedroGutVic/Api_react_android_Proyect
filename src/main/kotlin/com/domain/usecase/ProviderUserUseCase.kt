package com.domain.usecase

import com.data.repository.DatabaseUserRepository
import com.domain.models.UpdateUser
import com.domain.models.User
import org.slf4j.Logger
import org.slf4j.LoggerFactory

object ProviderUserUseCase {
    private val repository = DatabaseUserRepository()
    val logger: Logger = LoggerFactory.getLogger("UserUseCaseLogger")

    private val getAllUsersUseCase = GetAllUsersUseCase(repository)
    private val getUserByIdUseCase = GetUserByIdUseCase(repository)
    private val updateUserUseCase = UpdateUserUseCase(repository)
    private val insertUserUseCase = InsertUserUseCase(repository)
    private val deleteUserUseCase = DeleteUserUseCase(repository)

    fun getAllUsers() = getAllUsersUseCase()

    fun getUserById(id: Int?): User? {
        if (id == null) {
            logger.warn("El id esta vacio. No podemos buscar un usuario")
            return null
        }
        getUserByIdUseCase.id = id
        val user = getUserByIdUseCase()
        return if (user == null) {
            logger.warn("No se ha encontrado un usuario con ese $id.")
            null
        } else {
            user
        }
    }

    fun insertUser(user: User?): Int? {
        if (user == null) {
            logger.warn("No existen datos del usuario a insertar")
            return null
        }
        insertUserUseCase.user = user
        val res = insertUserUseCase()
        return if (res == null) {
            logger.warn("No se ha insertado el usuario. Posiblemente ya exista")
            null
        } else {
            res
        }
    }

    fun updateUser(updateUser: UpdateUser?, id: Int): Boolean {
        if (updateUser == null) {
            logger.warn("No existen datos del usuario a actualizar")
            return false
        }
        
        logger.info("ProviderUserUseCase.updateUser called para id=$id con datos: " +
            "username=${updateUser.username}, " +
            "email=${updateUser.email}, " +
            "role=${updateUser.role}, " +
            "avatar_url=${updateUser.avatar_url}")
        
        updateUserUseCase.updateUser = updateUser
        updateUserUseCase.id = id
        
        val result = updateUserUseCase()
        logger.info("ProviderUserUseCase.updateUser resultado para id=$id: $result")
        return result
    }

    fun deleteUser(id: Int): Boolean {
        deleteUserUseCase.id = id
        return deleteUserUseCase()
    }
}
