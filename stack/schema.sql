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
-- Tabla users con campos optimizados para JWT
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    avatar_url VARCHAR(500) NULL,
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

INSERT INTO videogames (nombre, precio, plataforma, caracteristicas, puntuacion, visitas) VALUES
    ('The Legend of Zelda: Breath of the Wild', 59.99, 'Nintendo Switch', 'Mundo abierto, aventura, exploracion', 9.2, 2000000),
    ('God of War Ragnarok', 69.99, 'PS5', 'Accion, historia, mitologia nordica', 8.8, 1800000),
    ('Halo Infinite', 49.99, 'Xbox Series', 'FPS, multijugador, campana', 8.5, 1500000),
    ('Elden Ring', 59.99, 'PC', 'RPG, mundo abierto, desafiante', 8.9, 1200000),
    ('Hades', 24.99, 'PC', 'Roguelike, accion, narrativa', 8.7, 3000000);

-- Datos de ejemplo (password = "password123" hasheado con bcrypt - esto es solo de ejemplo)
INSERT INTO users (username, email, password_hash, role, avatar_url, is_active) VALUES
    ('ana_perez', 'ana.perez@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'user', NULL, TRUE),
    ('luis_admin', 'luis.garcia@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'admin', NULL, TRUE),
    ('marta_lopez', 'marta.lopez@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/yfhFj1DM2pq9nVFUXH8fQm0vJUXGKK', 'user', 'https://example.com/avatars/marta.png', TRUE);


