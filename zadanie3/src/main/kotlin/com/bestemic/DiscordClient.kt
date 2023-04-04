package com.bestemic

import dev.kord.common.entity.Snowflake
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.service.RestClient
import dev.kord.common.Color

class DiscordClient(private val token: String) {
    private val rest = RestClient(token)

    suspend fun sendMessage(channelId: String, message: String) {
        rest.channel.createMessage(Snowflake(channelId)) {
            content = message
        }
    }
}