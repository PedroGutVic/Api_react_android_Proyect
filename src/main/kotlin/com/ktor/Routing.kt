package com.ktor

import com.domain.models.*
import com.domain.usecase.ProviderUseCase
import com.domain.usecase.ProviderUseCase.logger
import com.domain.usecase.ProviderUserUseCase
import com.domain.usecase.auth.AuthUseCase
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    val authUseCase = AuthUseCase()
    
    routing {
        /*
        ktor evalua los endpoint por orden.
         */

        // =============================================
        // ENDPOINTS DE AUTENTICACIÓN (Sin JWT)
        // =============================================
        route("/auth") {
            // POST /auth/register - Registro de usuario
            post("/register") {
                try {
                    val registerRequest = call.receive<RegisterRequest>()
                    
                    // Validaciones
                    if (registerRequest.username.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El username no puede estar vacio"))
                        return@post
                    }
                    if (registerRequest.email.isBlank() || !registerRequest.email.contains("@")) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El email no es valido"))
                        return@post
                    }
                    if (registerRequest.password.length < 6) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El password debe tener al menos 6 caracteres"))
                        return@post
                    }
                    
                    val authResponse = authUseCase.register(registerRequest)
                    if (authResponse == null) {
                        call.respond(HttpStatusCode.Conflict, mapOf("error" to "El usuario ya existe o hubo un error"))
                        return@post
                    }
                    
                    call.respond(HttpStatusCode.Created, authResponse)
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en el formato de datos"))
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en la conversion json"))
                }
            }

            // POST /auth/login - Login de usuario
            post("/login") {
                try {
                    val loginRequest = call.receive<LoginRequest>()
                    
                    if (loginRequest.email.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El email no puede estar vacio"))
                        return@post
                    }
                    if (loginRequest.password.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El password no puede estar vacio"))
                        return@post
                    }
                    
                    val authResponse = authUseCase.login(loginRequest)
                    if (authResponse == null) {
                        call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Credenciales invalidas"))
                        return@post
                    }
                    
                    call.respond(HttpStatusCode.OK, authResponse)
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en el formato de datos"))
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en la conversion json"))
                }
            }

            // POST /auth/refresh - Refrescar access token
            post("/refresh") {
                try {
                    val refreshRequest = call.receive<RefreshTokenRequest>()
                    
                    if (refreshRequest.refreshToken.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "El refresh token no puede estar vacio"))
                        return@post
                    }
                    
                    val refreshResponse = authUseCase.refreshAccessToken(refreshRequest)
                    if (refreshResponse == null) {
                        call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Refresh token invalido"))
                        return@post
                    }
                    
                    call.respond(HttpStatusCode.OK, refreshResponse)
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en el formato de datos"))
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Error en la conversion json"))
                }
            }

            // POST /auth/logout - Logout (requiere autenticación)
            authenticate("auth-jwt") {
                post("/logout") {
                    val userId = call.userId
                    if (userId == null) {
                        call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Token invalido"))
                        return@post
                    }
                    
                    val success = authUseCase.logout(userId)
                    if (!success) {
                        call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error en logout"))
                        return@post
                    }
                    
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Logout exitoso"))
                }
            }
        }

        // =============================================
        // ENDPOINT PROTEGIDO - GET /me (Información del usuario actual)
        // =============================================
        authenticate("auth-jwt") {
            get("/me") {
                val userId = call.userId
                if (userId == null) {
                    call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Token invalido"))
                    return@get
                }
                
                val user = authUseCase.getCurrentUser(userId)
                if (user == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Usuario no encontrado"))
                    return@get
                }
                
                call.respond(HttpStatusCode.OK, user)
            }
        }

        // =============================================
        // ENDPOINTS DE VIDEOJUEGOS
        // =============================================



        /*
        En esta ruta, comprobamos diferentes parametros:
        1.- Que no tenga ningun parametro. Devuelve todos los videojuegos sin filtro.
        2.- Que le pasemos el id por query. Devuelve ese videojuego. Lo tengo de ejemplo, ya que no deberia utilizar una query para un recurso especifico.
        3.- Que le pasemos la plataforma por query. Devuelve todos los videojuegos que tienen dicha plataforma.
         */
        authenticate("auth-jwt") {
            get("/api/videogame") {

                val videoGameId = call.request.queryParameters["id"]
                logger.warn("El id tiene de valor $videoGameId")
                if (videoGameId != null) {
                    val id = videoGameId.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest, "El id debe ser un numero entero")
                        return@get
                    }
                    val videoGame = ProviderUseCase.getVideoGameById(id)
                    if (videoGame == null) {
                        call.respond(HttpStatusCode.NotFound, "Videojuego no encontrado")
                    } else {
                        call.respond(videoGame)
                    }
                    return@get
                }

                //comprobamos si hemos pasado el parametro plataforma
                val plataforma = call.request.queryParameters["plataforma"]
                logger.warn("La plataforma pasada es $plataforma")
                if (plataforma != null) {
                    val videoGames = ProviderUseCase.getVideoGamesByPlataforma(plataforma)
                    call.respond(videoGames)
                } else { //No hemos pasado ninguna query
                    val videoGames = ProviderUseCase.getAllVideoGames()  //Ya tengo todos los videojuegos.
                    call.respond(videoGames)
                }
            }
        }

        /*
        Endpoint que no es recomendable, porque no se debe utilizar parametros de url para filtrar. Para eso estan los de consulta.
         */
        authenticate("auth-jwt") {
            get("/api/videogame/{videoGameId}") {

                //Comprobamos si se ha pasado el id por parametro
                val videoGameId = call.parameters["videoGameId"]
                if (videoGameId == null) {
                    call.respond(HttpStatusCode.BadRequest, "Debes pasar el id a buscar")
                    return@get
                }

                val id = videoGameId.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "El id debe ser un numero entero")
                    return@get
                }

                val videoGame = ProviderUseCase.getVideoGameById(id)
                if (videoGame == null) {
                    call.respond(HttpStatusCode.NotFound, "Videojuego no encontrado")
                    return@get
                }
                call.respond(videoGame)
            }
        }


        authenticate("auth-jwt") {
            post("/videogame") {
                val userRole = call.userRole
                if (userRole != "admin") {
                    call.respond(HttpStatusCode.Forbidden, mapOf("error" to "No tienes permisos para crear videojuegos"))
                    return@post
                }

                try {
                    val videoGame = call.receive<VideoGame>()
                    if (videoGame.nombre.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, "El nombre no puede estar vacio")
                        return@post
                    }
                    if (videoGame.precio < 0) {
                        call.respond(HttpStatusCode.BadRequest, "El precio no puede ser negativo")
                        return@post
                    }
                    if (videoGame.puntuacion < 0 || videoGame.puntuacion > 10) {
                        call.respond(HttpStatusCode.BadRequest, "La puntuacion debe estar entre 0 y 10")
                        return@post
                    }
                    if (videoGame.visitas < 0) {
                        call.respond(HttpStatusCode.BadRequest, "Las visitas no pueden ser negativas")
                        return@post
                    }
                    val newId = ProviderUseCase.insertVideoGame(videoGame)
                    if (newId == null) {
                        call.respond(HttpStatusCode.Conflict, "El videojuego no pudo insertarse. Puede que ya exista")
                        return@post
                    }
                    call.respond(HttpStatusCode.Created, "Se ha insertado correctamente con id =  $newId")
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, "Error en el formato de envio de datos o lectura del cuerpo.")
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest, "Problemas en la conversion json")
                }

            }
        }

        authenticate("auth-jwt") {
            patch("/videogame/{videoGameId}") {
                val userRole = call.userRole
                if (userRole != "admin") {
                    call.respond(HttpStatusCode.Forbidden, mapOf("error" to "No tienes permisos para editar videojuegos"))
                    return@patch
                }

                try {
                    val videoGameId = call.parameters["videoGameId"]
                    val id = videoGameId?.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest, "Debes identificar el videojuego con un id valido")
                        return@patch
                    }
                    val updateVideoGame = call.receive<UpdateVideoGame>()
                    val res = ProviderUseCase.updateVideoGame(updateVideoGame, id)
                    if (!res) {
                        call.respond(HttpStatusCode.Conflict, "El videojuego no pudo modificarse. Puede que no exista")
                        return@patch
                    }
                    call.respond(HttpStatusCode.Created, "Se ha actualizado correctamente con id =  $id")
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest, "Error en el formato de envio de los datos o lectura del cuerpo.")
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest, "Error en el formato de json")
                }
            }
        }


        authenticate("auth-jwt") {
            delete("/videogame/{videoGameId}") {
                val userRole = call.userRole
                if (userRole != "admin") {
                    call.respond(HttpStatusCode.Forbidden, mapOf("error" to "No tienes permisos para eliminar videojuegos"))
                    return@delete
                }

                val videoGameId = call.parameters["videoGameId"]
                val id = videoGameId?.toIntOrNull()
                logger.warn("Queremos borrar el videojuego con id $videoGameId")
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, "Debes identificar el videojuego")
                    return@delete
                }
                val res = ProviderUseCase.deleteVideoGame(id)
                if (!res) {
                    call.respond(HttpStatusCode.NotFound, "Videojuego no encontrado para borrar")
                } else {
                    call.respond(HttpStatusCode.NoContent)
                }
                return@delete
            }
        }

        // =============================================
        // ENDPOINTS DE USUARIOS (Protegidos con JWT)
        // =============================================
        authenticate("auth-jwt") {
            route("/api/users") {
                get {
                    val users = ProviderUserUseCase.getAllUsers()
                    call.respond(users)
                }
                
                post {
                    try {
                        val user = call.receive<User>()
                        if (user.username.isBlank()) {
                            call.respond(HttpStatusCode.BadRequest, "El username no puede estar vacio")
                            return@post
                        }
                        if (user.email.isBlank() || !user.email.contains("@")) {
                            call.respond(HttpStatusCode.BadRequest, "El email no es valido")
                            return@post
                        }
                        val newId = ProviderUserUseCase.insertUser(user)
                        if (newId == null) {
                            call.respond(HttpStatusCode.Conflict, "El usuario no pudo insertarse. Puede que ya exista")
                            return@post
                        }
                        call.respond(HttpStatusCode.Created, "Se ha insertado correctamente con id =  $newId")
                    } catch (e: IllegalStateException) {
                        call.respond(HttpStatusCode.BadRequest, "Error en el formato de envio de datos o lectura del cuerpo.")
                    } catch (e: JsonConvertException) {
                        call.respond(HttpStatusCode.BadRequest, "Problemas en la conversion json")
                    }
                }

                get("/{userId}") {
                    val userId = call.parameters["userId"]
                    if (userId == null) {
                        call.respond(HttpStatusCode.BadRequest, "Debes pasar el id a buscar")
                        return@get
                    }

                    val id = userId.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest, "El id debe ser un numero entero")
                        return@get
                    }

                    val user = ProviderUserUseCase.getUserById(id)
                    if (user == null) {
                        call.respond(HttpStatusCode.NotFound, "Usuario no encontrado")
                        return@get
                    }
                    call.respond(user)
                }

                patch("/{userId}") {
                    try {
                        val userId = call.parameters["userId"]
                        val id = userId?.toIntOrNull()
                        if (id == null) {
                            call.respond(HttpStatusCode.BadRequest, "Debes identificar el usuario con un id valido")
                            return@patch
                        }
                        
                        // Validación de permisos: solo admin o el propietario del perfil
                        val userRole = call.userRole
                        val userIdFromToken = call.userId
                        if (userRole != "admin" && userIdFromToken != id) {
                            call.respond(HttpStatusCode.Forbidden, mapOf("error" to "No tienes permisos para actualizar este usuario"))
                            return@patch
                        }
                        
                        val updateUser = call.receive<UpdateUser>()
                        if (updateUser.username != null && updateUser.username.isBlank()) {
                            call.respond(HttpStatusCode.BadRequest, "El username no puede estar vacio")
                            return@patch
                        }
                        if (updateUser.email != null && (updateUser.email.isBlank() || !updateUser.email.contains("@"))) {
                            call.respond(HttpStatusCode.BadRequest, "El email no es valido")
                            return@patch
                        }
                        if (updateUser.role != null && updateUser.role !in listOf("admin", "user", "usuario")) {
                            call.respond(HttpStatusCode.BadRequest, "El rol debe ser 'admin', 'user' o 'usuario'")
                            return@patch
                        }
                        
                        // Solo admins pueden cambiar roles
                        if (updateUser.role != null && userRole != "admin") {
                            call.respond(HttpStatusCode.Forbidden, mapOf("error" to "Solo los administradores pueden cambiar roles"))
                            return@patch
                        }
                        
                        logger.info("Actualizando usuario $id: username=${updateUser.username}, email=${updateUser.email}, role=${updateUser.role}")
                        
                        val res = ProviderUserUseCase.updateUser(updateUser, id)
                        if (!res) {
                            call.respond(HttpStatusCode.Conflict, "El usuario no pudo modificarse. Puede que no exista")
                            return@patch
                        }
                        call.respond(HttpStatusCode.OK, mapOf("message" to "Se ha actualizado correctamente con id = $id"))
                    } catch (e: IllegalStateException) {
                        logger.error("Error en PATCH /api/users: ${e.message}", e)
                        call.respond(HttpStatusCode.BadRequest, "Error en el formato de envio de los datos o lectura del cuerpo.")
                    } catch (e: JsonConvertException) {
                        logger.error("Error de JSON en PATCH /api/users: ${e.message}", e)
                        call.respond(HttpStatusCode.BadRequest, "Error en el formato de json")
                    } catch (e: Exception) {
                        logger.error("Error inesperado en PATCH /api/users: ${e.message}", e)
                        call.respond(HttpStatusCode.InternalServerError, "Error interno del servidor")
                    }
                }

                delete("/{userId}") {
                    val userRole = call.userRole
                    if (userRole != "admin") {
                        call.respond(HttpStatusCode.Forbidden, mapOf("error" to "No tienes permisos para eliminar usuarios"))
                        return@delete
                    }
                    
                    val userId = call.parameters["userId"]
                    val id = userId?.toIntOrNull()
                    logger.warn("Queremos borrar el usuario con id $userId")
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest, "Debes identificar el usuario")
                        return@delete
                    }
                    val res = ProviderUserUseCase.deleteUser(id)
                    if (!res) {
                        call.respond(HttpStatusCode.NotFound, "Usuario no encontrado para borrar")
                    } else {
                        call.respond(HttpStatusCode.NoContent)
                    }
                    return@delete
                }
            }
        }

        get("/") {
            val indexResource = this::class.java.classLoader.getResource("static/index.html")
            if (indexResource == null) {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }
            call.respondBytes(indexResource.readBytes(), ContentType.Text.Html)
        }

        get("{...}") {
            val path = call.request.path().trimStart('/')
            val resourcePath = "static/$path"
            val resource = this::class.java.classLoader.getResource(resourcePath)
            if (resource != null) {
                call.respondBytes(resource.readBytes(), ContentType.defaultForFilePath(path))
                return@get
            }
            if (path.contains('.')) {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }
            val indexResource = this::class.java.classLoader.getResource("static/index.html")
            if (indexResource == null) {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }
            call.respondBytes(indexResource.readBytes(), ContentType.Text.Html)
        }
    }
}



/*
1.- Utilizaremos un directorio para servir recursos estáticos, como imágenes, html, css, javaScript
    - Primer parámetro static, como prefijo de la url. http://localhost/static
    - Segundo parámetro static, como directorio dentro del proyecto donde buscará el recurso. Lo llamamos static.
    - Tenemos un fichero index.html dentro de static. Lo utilizaremos más adelante.

2.- Anadimos una ruta con videogame. Ejemplo http://localhost/videogame
    - Necesitamos mandar una solicitud HTTP que el servidor debera manejar. La solicitud es de tipo respond. Significa
    que el servidor mandara una respuesta al cliente. En dicha respuesta, tenemos una lista de objetos VideoGame
    que al tener la serializacion, la mandara en formato json. Para ello, utiliza el pluggin de serializacion (ContentNegotiation)
   configurada previamente para convertir automáticamente los objetos kotlin en json.

   - El flujo es:
        1.- El cliente hace una solicitud GET a videogame
        2.- ktor encuentra la routa get("/videogame")
        3.- El servidor crea una lista de objetos.
        4.- La lista se convierte automaticamente en Json gracias a CpontentNegotiation.
        5.- El servidor manda una respuesta al cliente.

        El pluggin Serialization, define como convertir los objetos kotlin a json y viceversa.
        El pluggin ContentNegotiation, gestiona el formato de respuesta o solicitudes dependiendo de las cabeceras
            enviadas por el cliente. HTTP Acept. Si el cliente envía Accpt:application/json, éste responderá automáticamente
            en json. Necesitaríamos otro Serializacón para xml y por tanto añadir soporte XML en el plugin ContentNegotiation.

        Por defecto, el servidor enviará la respuesta en JSON si el cliente en su solicitud no incluye una cabecera
        Accept con application/json
 */