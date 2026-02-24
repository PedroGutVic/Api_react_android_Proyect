
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
}

group = "com"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.host.common)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.server.auth.jwt)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.config.yaml)
    implementation(libs.mysql.connector.j)
    implementation(libs.dotenv.kotlin)
    implementation(libs.bcrypt)
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
}

tasks.register<Exec>("initDb") {
    val host = System.getenv("MYSQL_HOST") ?: System.getProperty("MYSQL_HOST") ?: "localhost"
    val port = System.getenv("MYSQL_HOST_PORT") ?: System.getProperty("MYSQL_HOST_PORT") ?: "33306"
    val database = System.getenv("MYSQL_DATABASE") ?: System.getProperty("MYSQL_DATABASE") ?: "basic_api_ktor"
    val user = System.getenv("MYSQL_USER") ?: System.getProperty("MYSQL_USER") ?: "root"
    val password = System.getenv("MYSQL_PASSWORD")
        ?: System.getProperty("MYSQL_PASSWORD")
        ?: System.getenv("MYSQL_ROOT_PASSWORD")
        ?: System.getProperty("MYSQL_ROOT_PASSWORD")
        ?: ""
    val schemaPath = project.rootDir.resolve("schema.sql").absolutePath

    val args = mutableListOf("-h", host, "-P", port, "-u", user)
    if (password.isNotEmpty()) {
        args.add("-p$password")
    }
    args.add("--database=$database")
    args.add("--execute=source $schemaPath")

    commandLine(mutableListOf("mysql").apply { addAll(args) })
}
