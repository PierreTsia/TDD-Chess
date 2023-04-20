<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useUserStore } from '~/stores/user'
import ChatMessageInput from '~/components/multi/ChatMessageInput.vue'

const chatStore = useChatStore()
const onlineGamesStore = useOnlineGamesStore()
const userStore = useUserStore()
const { chatMessages, chatUsers } = storeToRefs(chatStore)
const { currentGame } = storeToRefs(onlineGamesStore)
const { user } = storeToRefs(userStore)

const handleSendMessage = async (content: string) => {
  await chatStore.sendMessage({
    content,
    gameId: currentGame.value?.id as string,
    userId: user.value?.id as string,
  })
}
</script>

<template>
  <o-card class="!h-full flex flex-col justify-between relative">
    <template #header>
      <div class="flex flex-col justify-center items-center w-full">
        <o-text size="xl" font="bold">Game Chat</o-text>
        <o-text size="sm" class="!text-teal-500">
          {{ chatMessages.length }} messages from {{ chatUsers.length }} user(s)
        </o-text>
      </div>
    </template>

    <div class="flex flex-col justify-start items-end mb-4 relative top-8">
      <ChatMessage
        v-for="message in chatMessages"
        :key="message.id"
        :message="message" />

      <ChatMessageInput @on-send-message="handleSendMessage" />
    </div>
  </o-card>
</template>
