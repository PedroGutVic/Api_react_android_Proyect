package com.data.models

import com.domain.models.VideoGame

/*
Simulamos nuestro repositorio de datos. Aqui tendremos la lista de datos.
Lo tendremos para la incorporacion de los test.
 */
object VideoGameData {
    val listVideoGame = mutableListOf(
        VideoGame(1, "Halo Infinite", 59.99, "Xbox", "Shooter en mundo abierto", 8.5f, 1500000L),
        VideoGame(2, "The Legend of Zelda", 69.99, "Switch", "Aventura y exploracion", 9.2f, 2000000L),
        VideoGame(3, "God of War", 49.99, "PlayStation", "Accion narrativa", 8.8f, 1800000L),
        VideoGame(4, "Hades", 24.99, "PC", "Roguelike de accion", 8.9f, 1200000L),
        VideoGame(5, "Stardew Valley", 14.99, "PC", "Simulacion y granja", 8.7f, 3000000L),
        VideoGame(6, "Forza Horizon", 59.99, "Xbox", "Carreras de mundo abierto", 8.4f, 1600000L)
    )
}
