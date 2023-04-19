import { uniqBy } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { GameChatMessage } from '~/services/api'
import { SupabaseService } from '~/services/api'

export const useChatStore = defineStore('chat', () => {
  const api = new SupabaseService()

  const chatMessages = ref<GameChatMessage[]>([])

  const chatUsers = computed(() =>
    uniqBy(chatMessages.value, 'user_id').map((message) => message.user)
  )

  const fetchChatMessages = async (gameId: string) => {
    chatMessages.value = await api.getChatMessages(gameId)
  }

  return {
    chatMessages,
    chatUsers,
    fetchChatMessages,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
