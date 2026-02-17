package com.ktor

import io.ktor.server.application.*
import io.github.cdimascio.dotenv.dotenv

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    loadDotenv()
    configureSerialization()
    configureRouting()
}

private fun loadDotenv() {
    val env = dotenv {
        ignoreIfMissing = true
    }
    env.entries().forEach { entry ->
        if (System.getenv(entry.key) == null && System.getProperty(entry.key) == null) {
            System.setProperty(entry.key, entry.value)
        }
    }
}
