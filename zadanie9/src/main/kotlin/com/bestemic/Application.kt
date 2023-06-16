package com.bestemic

import com.aallam.openai.api.BetaOpenAI
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.OpenAI
import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.ktor.serialization.jackson.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class Product(val name: String, val category: String, val price: Int)

suspend fun main() {
    val dcToken = System.getenv("discord_token")
    val kord = Kord(dcToken)
    val channelId = "1092841235200344135"
    val categories = listOf("food", "book", "car", "music")

    val gptToken = System.getenv("gpt_token")
    val openai = OpenAI(token = gptToken)

    val products = listOf(
        Product("apple", "food", 2),
        Product("bread", "food", 5),
        Product("Harry Potter", "book", 43),
        Product("Ford Mustang", "car", 300000),
        Product("Ed Sheeran - Equals", "music", 2),
        Product("Ed Sheeran - Subtract", "music", 2),
        Product("Tesla", "car", 230000),
    )

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on

        if (message.content.startsWith('!')) {
            val command = message.content.substringAfter('!')

            if (command == "categories") {
                message.channel.createMessage(Json.encodeToString(categories))
            }

            if (categories.contains(command)) {
                message.channel.createMessage(Json.encodeToString(products.filter { it.category == command }))
            } else {
                message.channel.createMessage("Category not found")
            }
        }

        println("A message has been received from the user ${message.author?.tag}: ${message.content}")
    }

    embeddedServer(Netty, port = 8080) {
        messageSenderModule(kord, channelId)
    }.start(wait = false)

    embeddedServer(Netty, port = 8081) {
        gptService(openai)
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

data class Text(val message: String)

@OptIn(BetaOpenAI::class)
fun Application.gptService(openai: OpenAI) {
    install(CORS) {
        anyHost()
    }

    install(ContentNegotiation) {
        jackson {}
    }

    val openings = listOf(
        "Witaj! W czym mogę pomóc?",
        "Cześć! Jestem do twojej dyspozycji.",
        "Hej! Z chęcią odpowiem na twoje pytania.",
        "Dzień dobry! W czym mogę Cię wspomóc dzisiaj?",
        "Witam serdecznie! Co mogę dla Ciebie zrobić?"
    )

    val closings = listOf(
        "Dziękuję za rozmowę.",
        "Mam nadzieję, że odpowiedziałem na Twoje pytanie.",
        "Do kolejnego spotkania.",
        "Życzę miłego dnia!",
        "Do zobaczenia następnym razem!"
    )

    routing {
        post("/gpt") {
            val message = call.receive<String>()
            val completion = openai.chatCompletion(
                ChatCompletionRequest(
                    model = ModelId("gpt-3.5-turbo"),
                    messages = listOf(
                        ChatMessage(
                            role = ChatRole.User,
                            content = message
                        )
                    )
                )
            )

            completion.choices.first().message?.let { it1 -> call.respond(it1.content) }
        }

        get("/opening") {
            call.respond(Text(openings.random()))
        }

        get("/closing") {
            call.respond(Text(closings.random()))
        }
    }
}