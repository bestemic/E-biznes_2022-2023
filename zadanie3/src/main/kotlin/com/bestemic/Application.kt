package com.bestemic

import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


suspend fun main() {
    val kord = Kord("token")
    val channelId = "1092841235200344135"

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on

        messageHandler(this)
    }

    embeddedServer(Netty, port = 8080) {
        messageSenderModule(kord, channelId)
    }.start(wait = false)

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}

fun Application.messageSenderModule(kord: Kord, channelId: String) {
    routing {
        post("/send") {
            val message = call.receive<String>()
            kord.rest.channel.createMessage(Snowflake(channelId)) {
                content = message
            }
            call.respond("Message was sent to channel with id $channelId.")
        }
    }
}

fun messageHandler(event: MessageCreateEvent) {
    println("A message has been received from the user ${event.message.author?.tag}: ${event.message.content}")
}


