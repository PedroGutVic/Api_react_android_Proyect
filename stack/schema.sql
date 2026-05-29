-- MariaDB schema for videogames and usuarios
CREATE DATABASE IF NOT EXISTS basic_api_ktor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE basic_api_ktor;
CREATE TABLE IF NOT EXISTS videogames (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    plataforma VARCHAR(100) NOT NULL,
    caracteristicas TEXT NOT NULL,
    puntuacion FLOAT(25) NOT NULL,
    visitas BIGINT(255) NOT NULL,
    imagen_url VARCHAR(500) NULL,
    PRIMARY KEY (id),
    INDEX idx_videogames_plataforma (plataforma),
    INDEX idx_videogames_nombre (nombre)
) ;
-- Tabla users con campos optimizados para JWT
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    avatar_url LONGTEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    refresh_token_hash VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_ratings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    game_id INT UNSIGNED NOT NULL,
    rating TINYINT NOT NULL,
    UNIQUE KEY unique_user_game (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES videogames(id) ON DELETE CASCADE
);

INSERT INTO videogames (nombre, precio, plataforma, caracteristicas, puntuacion, visitas, imagen_url) VALUES
-- RPG
('Elden Ring', 59.99, 'PC', 'RPG de mundo abierto, combate exigente, lore profundo de Miyazaki y George R.R. Martin', 9.5, 3200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg'),
('Baldur''s Gate 3', 59.99, 'PC', 'RPG por turnos, co-op hasta 4 jugadores, historia ramificada con infinitas decisiones', 9.8, 2800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg'),
('The Witcher 3: Wild Hunt', 39.99, 'PC', 'RPG de mundo abierto, narrativa profunda, combate de espadas y magia, mundo vivo', 9.3, 4100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg'),
('Cyberpunk 2077', 39.99, 'PC', 'RPG de accion en primera persona, mundo abierto futurista, historia de Vi en Night City', 8.9, 3500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg'),
('Skyrim Special Edition', 39.99, 'PC', 'RPG de mundo abierto, dragones, mazmorras, infinitas misiones y soporte de mods', 8.7, 5000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg'),
('Mass Effect Legendary Edition', 59.99, 'PC', 'Trilogia RPG de ciencia ficcion, decisiones que atraviesan los tres juegos', 9.2, 1800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/header.jpg'),
('Fallout 4', 29.99, 'PC', 'RPG postapocaliptico, construccion de asentamientos, mundo abierto gigante', 8.1, 3200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/377160/header.jpg'),
('Persona 5 Royal', 59.99, 'PC', 'JRPG por turnos, vida cotidiana y dungeon crawler, estilo artistico unico', 9.4, 1500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg'),
('Final Fantasy VII Remake', 59.99, 'PC', 'JRPG de accion, remake del clasico de 1997, historia expandida de Cloud y AVALANCHE', 8.8, 1200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/header.jpg'),
('Final Fantasy XVI', 69.99, 'PC', 'JRPG de accion, combate espectacular, mundo oscuro de Valisthea', 8.7, 980000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/header.jpg'),
('Disco Elysium', 39.99, 'PC', 'RPG de dialogo y detectives, escritura brillante, sin combate convencional', 9.0, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg'),
('Diablo IV', 69.99, 'PC', 'ARPG oscuro, mundo abierto, temporadas de contenido, cooperativo online', 8.3, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2399830/header.jpg'),
('Path of Exile', 0.00, 'PC', 'ARPG free-to-play, construccion de personajes extremadamente profunda, temporadas constantes', 8.9, 4500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg'),
-- Accion/Aventura
('God of War', 49.99, 'PC', 'Accion aventura, mitologia nordica, historia de Kratos y Atreus, combate visceral', 9.5, 2600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg'),
('God of War: Ragnarok', 69.99, 'PS5', 'Secuela epica, conclusion de la saga nordica, personajes memorables, combate refinado', 9.3, 2400000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg'),
('Red Dead Redemption 2', 39.99, 'PC', 'Mundo abierto en el Lejano Oeste, narrativa cinematografica, detalles de simulacion increibles', 9.4, 3800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg'),
('Grand Theft Auto V', 29.99, 'PC', 'Mundo abierto moderno, tres protagonistas, modo historia y GTA Online con miles de horas', 8.5, 7000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg'),
('Spider-Man Remastered', 59.99, 'PC', 'Accion aventura, balanceo por Nueva York, historia de Peter Parker, combate acrobatico', 9.1, 1700000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg'),
('Spider-Man: Miles Morales', 49.99, 'PC', 'Nuevo Spider-Man, poderes de bio-electricidad, historia emotiva en Harlem', 8.9, 1500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1976870/header.jpg'),
('Ghost of Tsushima', 59.99, 'PC', 'Mundo abierto samurai, Japon feudal, combate de katana elegante, visualmente impresionante', 9.2, 1900000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg'),
('Death Stranding', 39.99, 'PC', 'Aventura de entrega, mundo postapocaliptico, conectar a la humanidad, Hideo Kojima', 8.2, 1300000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg'),
('Horizon Zero Dawn', 49.99, 'PC', 'Mundo abierto, robots prehistoricos, historia de Aloy en un futuro postapocaliptico', 8.8, 2200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg'),
('Batman: Arkham Knight', 19.99, 'PC', 'Accion de superheroes, Gotham abierta, Batmovil jugable, conclusion de la trilogia Arkham', 8.6, 2900000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/208650/header.jpg'),
('The Last of Us Part I', 59.99, 'PC', 'Aventura survival, historia de Joel y Ellie en un mundo postapocaliptico, narrativa emotiva', 9.0, 1600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg'),
('Alan Wake 2', 49.99, 'PC', 'Terror psicologico, narrativa metaficcional, Alan Wake vs Saga Anderson, secuela magistral', 8.9, 890000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1903850/header.jpg'),
('Control', 29.99, 'PC', 'Accion con poderes telekinetivos, Bureau Federal de Control, lore misterioso y extravagante', 8.5, 1400000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg'),
('Deathloop', 29.99, 'PC', 'FPS con bucle temporal, matar 8 objetivos en un dia, investigacion y sigilo opcional', 8.0, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1252330/header.jpg'),
('Ghostwire: Tokyo', 39.99, 'PC', 'Accion en primera persona, Tokio fantasmal, poderes elementales, japonismo sobrenatural', 7.9, 780000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1475810/header.jpg'),
-- Souls-like
('Sekiro: Shadows Die Twice', 59.99, 'PC', 'Accion en el Japon feudal, combate de desvios preciso, sin builds, maestria pura', 9.1, 1700000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg'),
('Dark Souls III', 39.99, 'PC', 'RPG de accion oscuro, mundo interconectado, construccion de personajes, final de trilogia', 8.9, 2500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg'),
('Dark Souls: Remastered', 39.99, 'PC', 'El clasico que inicio el genero moderno, Lordran, lore criptico, desafio legendario', 8.7, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/570940/header.jpg'),
('Nioh 2', 49.99, 'PC', 'Souls-like en el Japon del siglo XVI, sistema de yokai, construccion de personajes profunda', 8.8, 1200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1325200/header.jpg'),
('Lies of P', 59.99, 'PC', 'Souls-like inspirado en Pinocho, Europa de fantasia oscura, sistema de armas modular', 8.3, 860000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg'),
-- FPS
('Doom Eternal', 39.99, 'PC', 'FPS de combate frenetico, movimiento constante, demonios y heavy metal, maestria de arena', 9.0, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg'),
('DOOM (2016)', 19.99, 'PC', 'FPS revival clasico, combate dinamico, no hay tiempo para detenerse, OST de Mick Gordon', 8.8, 2600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/379720/header.jpg'),
('Counter-Strike 2', 0.00, 'PC', 'FPS competitivo free-to-play, el shooter tactico mas popular del mundo, 5v5 por objetivos', 7.8, 12000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'),
('Half-Life: Alyx', 59.99, 'PC', 'FPS de realidad virtual, precuela de Half-Life 2, la mejor experiencia VR hasta la fecha', 9.3, 980000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg'),
('Apex Legends', 0.00, 'PC', 'Battle royale free-to-play, 20 leyendas con habilidades unicas, movimiento agil, 60 jugadores', 8.4, 8500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg'),
('Wolfenstein II: The New Colossus', 29.99, 'PC', 'FPS de historia, America ocupada por nazis, B.J. Blazkowicz, accion cinematica', 8.3, 1500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/612880/header.jpg'),
-- Lucha
('Street Fighter 6', 59.99, 'PC', 'Juego de lucha, World Tour con historia, online robusto, roster amplio, drive system', 9.0, 1300000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg'),
('Tekken 8', 59.99, 'PC', 'Juego de lucha 3D, historia del clan Mishima, 32 luchadores, sistema de heat dinamico', 8.8, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg'),
('Mortal Kombat 11', 39.99, 'PC', 'Juego de lucha brutal, historia de viajes en el tiempo, fatalities espectaculares', 8.3, 2000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/976310/header.jpg'),
-- Plataformas/Indie
('Hollow Knight', 14.99, 'PC', 'Metroidvania de insectos, mundo subterraneo enorme, combate preciso, lore criptico hermoso', 9.3, 4200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg'),
('Celeste', 19.99, 'PC', 'Plataformas de precision, historia sobre salud mental, level design magistral, soundtrack increible', 9.2, 2800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg'),
('Cuphead', 19.99, 'PC', 'Run and gun de jefes, estilo animacion anos 30, dificultad extrema, arte unico', 8.9, 3100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg'),
('Ori and the Will of the Wisps', 29.99, 'PC', 'Plataformas de movimiento fluido, mundo de fantasia, historia emotiva, visualmente espectacular', 9.1, 1900000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg'),
('Ori and the Blind Forest', 19.99, 'PC', 'Metroidvania de precision, la historia original de Ori, belleza visual, mundo de Nibel', 9.0, 2200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/261570/header.jpg'),
('Sifu', 39.99, 'PC', 'Juego de artes marciales, el tiempo avanza cuando mueres, domina el kung fu o envejece', 8.4, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1468240/header.jpg'),
('Ghostrunner', 24.99, 'PC', 'FPS de katana en primera persona, un golpe mata, ciudad cyberpunk vertical, velocidad extrema', 8.5, 1300000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1299610/header.jpg'),
('Katana Zero', 14.99, 'PC', 'Accion 2D con tiempo lento, asesino amnesico, narrativa no lineal, pixel art', 9.0, 1500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1002860/header.jpg'),
-- Roguelike
('Hades', 24.99, 'PC', 'Roguelike de accion, hijo de Hades escapa del inframundo, narrativa que avanza con cada run', 9.6, 4500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg'),
('Dead Cells', 24.99, 'PC', 'Roguelike metroidvania, movimiento fluido, builds variadas, siempre fresco en cada run', 9.0, 3200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg'),
('Risk of Rain 2', 24.99, 'PC', 'Roguelike 3D cooperativo, items se apilan absurdamente, caos divertido en cada run', 8.8, 2600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg'),
('Slay the Spire', 24.99, 'PC', 'Roguelike deckbuilder, construye un mazo mientras subes la espira, estrategia pura', 9.1, 3000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg'),
('Vampire Survivors', 4.99, 'PC', 'Roguelite de supervivencia, bullet heaven, simple de aprender, infinitamente adictivo', 9.2, 5200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1794440/header.jpg'),
('The Binding of Isaac: Repentance', 14.99, 'PC', 'Roguelike dungeon crawler, biblico y perturbador, 500 items, infinita rejugabilidad', 9.4, 4100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/250900/header.jpg'),
('Returnal', 59.99, 'PS5', 'Roguelite 3D, astronauta en bucle temporal en planeta alienigena, combate intenso', 8.7, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1649240/header.jpg'),
('Inscryption', 19.99, 'PC', 'Roguelike deckbuilder con metanarracion perturbadora, mucho mas de lo que parece', 9.3, 1800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1092790/header.jpg'),
-- Simulacion/Sandbox
('Stardew Valley', 14.99, 'PC', 'Simulacion de granja, relajante, profundo sistema de relaciones y mineria, obra de un solo desarrollador', 9.5, 7500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg'),
('Terraria', 9.99, 'PC', 'Sandbox 2D, mineria y construccion, infinitos biomas y jefes, cooperativo hasta 8', 9.4, 8000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg'),
('No Man''s Sky', 59.99, 'PC', 'Exploracion espacial infinita, 18 quintillones de planetas, cooperativo, completamente renovado', 8.5, 2800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg'),
('Subnautica', 29.99, 'PC', 'Supervivencia subacuatica en planeta alienigena, explorar el oceano profundo, historia intrigante', 9.2, 3100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg'),
('Valheim', 19.99, 'PC', 'Supervivencia vikinga, cooperativo hasta 10, construccion avanzada, jefes de mitologia nordica', 8.8, 3400000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg'),
('Satisfactory', 34.99, 'PC', 'Construccion de fabricas en primera persona, automatizar produccion, mundo enorme, cooperativo', 9.1, 2200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg'),
('Factorio', 35.00, 'PC', 'El mejor juego de logistica, construir y optimizar fabricas, una partida nunca termina de verdad', 9.8, 2500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg'),
('Rust', 39.99, 'PC', 'Supervivencia multijugador masiva, construir, saquear, traicionar, el ciclo sin fin', 7.9, 4200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg'),
('Sons of the Forest', 29.99, 'PC', 'Supervivencia en isla con canibales mutantes, cooperativo, construccion libre, sucesor de The Forest', 8.1, 1900000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg'),
('Grounded', 39.99, 'PC', 'Supervivencia reducido al tamano de un insecto, jardin enorme lleno de peligros, cooperativo', 8.2, 1700000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/962130/header.jpg'),
('Planet Zoo', 34.99, 'PC', 'Simulacion de zoo, construir y gestionar, bienestar animal, animales con IA avanzada', 8.7, 1600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/703080/header.jpg'),
('Cities: Skylines II', 49.99, 'PC', 'Simulacion de ciudad, sucesor del rey del genero, gestion de transporte y economia', 7.5, 1200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg'),
-- Estrategia
('Civilization VI', 29.99, 'PC', 'Estrategia por turnos, construir una civilizacion desde la prehistoria, solo una vuelta mas', 8.8, 4500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg'),
('Total War: Warhammer III', 59.99, 'PC', 'Estrategia 4X y batallas tacticas en tiempo real, facciones de fantasia epicas', 8.3, 1400000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg'),
('Age of Empires IV', 39.99, 'PC', 'RTS de historia, 8 civilizaciones, campanas documentales, multiplayer competitivo', 8.2, 1800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg'),
('Starfield', 69.99, 'PC', 'RPG espacial de Bethesda, 1000 planetas explorables, construccion de nave, narrativa ramificada', 7.8, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg'),
-- Carreras/Deportes
('Forza Horizon 5', 59.99, 'Xbox Series', 'Carreras de mundo abierto en Mexico, 500 coches, cooperativo, espectacular visualmente', 9.3, 2900000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg'),
('Rocket League', 0.00, 'PC', 'Futbol con coches cohete, facil de aprender dificil de dominar, free-to-play, clasificatorias', 8.7, 9000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg'),
-- Aventura narrativa
('Outer Wilds', 24.99, 'PC', 'Exploracion espacial en bucle de 22 minutos, descubrir secretos sin pistas, una de las mejores narrativas', 9.4, 1500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg'),
('What Remains of Edith Finch', 19.99, 'PC', 'Aventura narrativa, historias de una familia maldita, corto pero impactante, obra de arte', 9.0, 1200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/501300/header.jpg'),
('Firewatch', 19.99, 'PC', 'Aventura en parque de Wyoming, misterio, dialogo brillante, atmosfera unica', 8.5, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg'),
('SOMA', 29.99, 'PC', 'Terror existencial submarino, que significa ser humano, historia perturbadora de ciencia ficcion', 9.1, 1100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/282140/header.jpg'),
('INSIDE', 9.99, 'PC', 'Plataformas puzzle atmosferico, distopico, sin palabras pero narrativa impactante', 9.2, 2000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/304430/header.jpg'),
('Limbo', 9.99, 'PC', 'Puzzle plataformas en blanco y negro, solitario y perturbador, clasico indie', 8.8, 2500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/48000/header.jpg'),
('Don''t Starve Together', 14.99, 'PC', 'Supervivencia cooperativa, mundo gotico de animacion, morir aprender sobrevivir mas tiempo', 8.9, 3600000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/322330/header.jpg'),
-- Terror
('Resident Evil Village', 39.99, 'PC', 'Terror de accion, Ethan Winters en aldea europea, Lady Dimitrescu iconica', 8.8, 2000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg'),
('Resident Evil 4 Remake', 59.99, 'PC', 'Remake del mejor survival horror, Leon en aldea espanola, actualizado sin perder esencia', 9.3, 1800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg'),
('Resident Evil 2 Remake', 39.99, 'PC', 'Remake del clasico, Mr. X como amenaza constante, camara por encima del hombro', 9.0, 1700000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/883710/header.jpg'),
('Little Nightmares II', 19.99, 'PC', 'Puzzle de plataformas de terror, atmosfera opresiva, mundo extrano y hermoso', 8.6, 1400000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/860510/header.jpg'),
-- Multijugador
('Among Us', 4.99, 'PC', 'Deduccion social espacial, 4-15 jugadores, impostores ocultos, misterio y traicion divertida', 7.8, 12000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg'),
('Portal 2', 9.99, 'PC', 'Puzzle de portales, cooperativo magistral, narrativa y humor impecable, Valve en su mejor momento', 9.8, 5000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg'),
('Dota 2', 0.00, 'PC', 'MOBA free-to-play, la mayor competicion de esports del mundo, profundidad abismal', 8.0, 15000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg'),
-- Monster Hunter
('Monster Hunter World', 29.99, 'PC', 'Cazar monstruos en ecosistemas vivos, 14 tipos de armas, cooperativo hasta 4, ciclos de recompensas', 9.2, 3500000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg'),
('Monster Hunter Rise', 39.99, 'PC', 'Palemute y Silkbind, movimiento aereo, nuevo ritmo de caza, multijugador sin costuras', 8.8, 2100000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/header.jpg'),
('Monster Hunter World: Iceborne', 39.99, 'PC', 'Expansion masiva de MHW, monstruos arcticos, maestria y endgame interminable', 9.2, 2000000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/794489/header.jpg'),
-- MMO
('Final Fantasy XIV: Endwalker', 39.99, 'PC', 'MMORPG, conclusion de la historia de la hidra de luz, comunidad increible', 9.5, 2800000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/39210/header.jpg'),
('Lost Ark', 0.00, 'PC', 'MMORPG ARPG free-to-play, combate dinamico, raids de alto nivel', 7.8, 3200000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg'),
-- Nintendo Switch exclusivos
('The Legend of Zelda: Tears of the Kingdom', 69.99, 'Nintendo Switch', 'Mundo abierto, construccion libre con Ultrahand, volar por el cielo de Hyrule, superacion de BOTW', 9.8, 4200000, 'https://upload.wikimedia.org/wikipedia/en/4/4e/The_Legend_of_Zelda-_Tears_of_the_Kingdom_cover.jpg'),
('The Legend of Zelda: Breath of the Wild', 59.99, 'Nintendo Switch', 'Revolucion del mundo abierto, fisica emergente, Hyrule enorme y vivo, libertad total', 9.7, 5500000, 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg'),
('Super Mario Odyssey', 59.99, 'Nintendo Switch', 'Plataformas 3D, capturar enemigos con Cappy, mundos creativos, Nintendo en su mejor momento', 9.5, 3800000, 'https://upload.wikimedia.org/wikipedia/en/8/8b/Super_Mario_Odyssey.jpg'),
('Super Mario Bros. Wonder', 59.99, 'Nintendo Switch', 'Plataformas 2D fresco e imaginativo, flores wonder que transforman niveles completamente', 9.4, 2100000, 'https://upload.wikimedia.org/wikipedia/en/1/17/Super_Mario_Bros._Wonder_cover_artwork.jpg'),
('Mario Kart 8 Deluxe', 59.99, 'Nintendo Switch', 'El mejor juego de karts, 96 pistas, multijugador hasta 12 en linea, imprescindible en Switch', 9.2, 6000000, 'https://upload.wikimedia.org/wikipedia/en/7/72/MarioKart8Deluxe.jpg'),
('Metroid Dread', 59.99, 'Nintendo Switch', 'Metroidvania 2D, Samus vs los E.M.M.I., el mejor Metroid en decadas', 8.9, 1600000, 'https://upload.wikimedia.org/wikipedia/en/0/03/Metroid_Dread_cover.jpg'),
('Splatoon 3', 59.99, 'Nintendo Switch', 'Shooter de pintura multijugador, fresco y original, modos competitivos y cooperativos', 8.6, 2300000, 'https://upload.wikimedia.org/wikipedia/en/d/da/Splatoon_3_cover_art.jpg'),
('Pokemon Scarlet', 59.99, 'Nintendo Switch', 'RPG de Pokemon en mundo abierto por primera vez, region Paldea, tres historias principales', 7.8, 3500000, 'https://upload.wikimedia.org/wikipedia/en/1/18/Pokemon_Scarlet_cover.jpg'),
('Animal Crossing: New Horizons', 59.99, 'Nintendo Switch', 'Simulacion de vida en isla, relajante, personalizable al infinito, fenomeno durante pandemia', 8.7, 4800000, 'https://upload.wikimedia.org/wikipedia/en/8/8f/Animal_Crossing_New_Horizons.jpg'),
('Xenoblade Chronicles 3', 59.99, 'Nintendo Switch', 'JRPG de mundo abierto, historia epica, sistema de combate complejo, mas de 80 horas', 9.0, 1200000, 'https://upload.wikimedia.org/wikipedia/en/f/f0/Xenoblade_Chronicles_3.jpg'),
('Kirby and the Forgotten Land', 59.99, 'Nintendo Switch', 'Plataformas 3D de Kirby, cooperativo, niveles creativos, el mejor Kirby hasta la fecha', 8.8, 1800000, 'https://upload.wikimedia.org/wikipedia/en/3/34/Kirby_and_the_Forgotten_Land.jpg'),
('Fire Emblem Engage', 59.99, 'Nintendo Switch', 'Estrategia por turnos, emblemas de heroes clasicos, combate tactico profundo', 8.4, 1100000, 'https://upload.wikimedia.org/wikipedia/en/e/e7/Fire_Emblem_Engage.jpg'),
-- Deckbuilder
('Monster Train', 24.99, 'PC', 'Roguelike deckbuilder, defender un tren del infierno, dos pisos de combate, multijugador online', 8.8, 1300000, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1102190/header.jpg');

-- Datos de ejemplo (password = "password123" hasheado con bcrypt - esto es solo de ejemplo)
INSERT INTO users (username, email, password_hash, role, avatar_url, is_active) VALUES
    ('ana_perez', 'ana.perez@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'user', NULL, TRUE),
    ('luis_admin', 'luis.garcia@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'admin', NULL, TRUE),
    ('marta_lopez', 'marta.lopez@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'user', 'https://example.com/avatars/marta.png', TRUE);
