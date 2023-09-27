<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useUserStore } from '~/stores/user'
import ChatMessageInput from '~/components/multi/ChatMessageInput.vue'

const chatStore = useChatStore()
const onlineGamesStore = useOnlineGamesStore()
const userStore = useUserStore()
const { gameMessages, chatUsers } = storeToRefs(chatStore)
const { currentGame } = storeToRefs(onlineGamesStore)
const { user } = storeToRefs(userStore)

const chatInput = ref(null)

const chatIsVisible = useElementVisibility(chatInput)

const scrollToBottom = () => {
  nextTick(() => {
    const lastMessageEl = document.getElementById('chatInput')

    if (lastMessageEl) {
      lastMessageEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

onMounted(() => {
  if (!chatIsVisible.value) {
    scrollToBottom()
  }
})

watch(
  gameMessages,
  () => {
    scrollToBottom()
  },
  {
    deep: true,
  }
)

const handleSendMessage = async (content: string) => {
  await chatStore.sendMessage({
    content,
    gameId: currentGame.value?.id as string,
    userId: user.value?.id as string,
  })
}
</script>

<template>
  <o-card
    class="min-h-[400px] flex flex-col justify-between relative !overflow-auto relative z-1">
    <template #header>
      <div class="flex flex-col justify-center items-center w-full">
        <o-text size="xl" font="bold">Game Chat</o-text>
        <o-text size="sm" class="!text-teal-500">
          {{ gameMessages?.length }} messages from
          {{ chatUsers?.length }} user(s)
        </o-text>
      </div>
    </template>

    <div class="flex flex-col justify-start items-end mb-4 relative top-8">
      <ChatMessage
        v-for="message in gameMessages"
        :key="message.id"
        :message="message" />

      <ChatMessageInput
        id="chatInput"
        ref="chatInput"
        @on-send-message="handleSendMessage" />
    </div>
  </o-card>
</template>
