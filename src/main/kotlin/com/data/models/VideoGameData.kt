package com.data.models

import com.domain.models.VideoGame

/*
Simulamos nuestro repositorio de datos. Aqui tendremos la lista de datos.
Lo tendremos para la incorporacion de los test.
 */
object VideoGameData {
    val listVideoGame = mutableListOf(
        VideoGame(1, "Halo Infinite", 59.99, "Xbox", "Shooter en mundo abierto"),
        VideoGame(2, "The Legend of Zelda", 69.99, "Switch", "Aventura y exploracion"),
        VideoGame(3, "God of War", 49.99, "PlayStation", "Accion narrativa"),
        VideoGame(4, "Hades", 24.99, "PC", "Roguelike de accion"),
        VideoGame(5, "Stardew Valley", 14.99, "PC", "Simulacion y granja"),
        VideoGame(6, "Forza Horizon", 59.99, "Xbox", "Carreras de mundo abierto")
    )
}
