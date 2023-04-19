<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()
const { messageFeed, chatUsers } = storeToRefs(chatStore)
</script>

<template>
  <o-card class="!h-full flex flex-col justify-between">
    <template #header>
      <div class="flex flex-col justify-center items-center w-full">
        <o-text size="xl" font="bold">Game Chat</o-text>
        <o-text size="sm" class="!text-teal-500">
          {{ messageFeed.length }} messages from {{ chatUsers.length }} user(s)
        </o-text>
      </div>
    </template>

    <div class="flex flex-col justify-start items-end mb-4">
      <ChatMessage
        v-for="message in messageFeed"
        :key="message.id"
        :message="message" />
    </div>
  </o-card>
</template>
