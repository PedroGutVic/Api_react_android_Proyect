package com.domain.repository
import com.domain.models.RateResponse
import com.domain.models.UpdateVideoGame
import com.domain.models.VideoGame

interface VideoGameInterface {
    fun getAllVideoGames(): List<VideoGame>

    fun getVideoGamesByPlataforma(plataforma: String): List<VideoGame>

    fun getVideoGamesByNombre(nombre: String): List<VideoGame>

    //Debe ser nullable, por si no existe.
    fun getVideoGameById(id: Int): VideoGame?

    fun postVideoGame(videoGame: VideoGame): Int?

    fun updateVideoGame(videoGame: UpdateVideoGame, id: Int): Boolean

    fun incrementVisitas(id: Int): Boolean

    fun deleteVideoGame(id: Int): Boolean
    
    fun rateGame(userId: Int, gameId: Int, rating: Int): RateResponse?
    
    fun getUserRating(userId: Int, gameId: Int): Int?
}
