-- MariaDB schema for videogames and usuarios
CREATE DATABASE IF NOT EXISTS basic_api_ktor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE basic_api_ktor;
CREATE TABLE IF NOT EXISTS videogames (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    plataforma VARCHAR(100) NOT NULL,
    caracteristicas TEXT NOT NULL,
    puntuacion FLOAT(25)NOT NULL,
    visitas BIGINT(255)NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_videogames_plataforma (plataforma),
    INDEX idx_videogames_nombre (nombre)
) ;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    foto_perfil_url VARCHAR(500) NULL,
    rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email)
) ;

INSERT INTO videogames (nombre, precio, plataforma, caracteristicas, puntuacion, visitas) VALUES
    ('The Legend of Zelda: Breath of the Wild', 59.99, 'Nintendo Switch', 'Mundo abierto, aventura, exploracion', 9.2, 2000000),
    ('God of War Ragnarok', 69.99, 'PS5', 'Accion, historia, mitologia nordica', 8.8, 1800000),
    ('Halo Infinite', 49.99, 'Xbox Series', 'FPS, multijugador, campana', 8.5, 1500000),
    ('Elden Ring', 59.99, 'PC', 'RPG, mundo abierto, desafiante', 8.9, 1200000),
    ('Hades', 24.99, 'PC', 'Roguelike, accion, narrativa', 8.7, 3000000);

INSERT INTO usuarios (nombre, email, password_hash, foto_perfil_url, rol) VALUES
    ('Ana Perez', 'ana.perez@example.com', 'hash_ana_123', NULL, 'usuario'),
    ('Luis Garcia', 'luis.garcia@example.com', 'hash_luis_456', NULL, 'admin'),
    ('Marta Lopez', 'marta.lopez@example.com', 'hash_marta_789', 'https://example.com/avatars/marta.png', 'usuario');

