package com.bestemic

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    val channelId = "1092841235200344135"
    val discordClient = DiscordClient("MTA5MjgzOTYzNzk4MDAyNDkxMw.GEuS1v.exSryIc0utuk1N1wQhuJzHS31W5SI_hNo-SEyY")


    embeddedServer(Netty, port = 8080) {
        messageSenderModule(discordClient, channelId)
    }.start(wait = true)
}

fun Application.messageSenderModule(discordClient: DiscordClient, channelId: String) {
    routing {
        post("/send") {
            val message = call.receive<String>()
            discordClient.sendMessage(channelId, message)
            call.respond("Message was sent to channel with id $channelId.")
        }
    }
}


