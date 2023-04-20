import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { uniqBy } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ChatMessage } from '~/modules/types/supabase'
import type { GameChatMessage } from '~/services/api'
import { SupabaseService } from '~/services/api'

export const useChatStore = defineStore('chat', () => {
  const api = new SupabaseService()

  const chatMessages = ref<GameChatMessage[]>([])

  const chatUsers = computed(() =>
    uniqBy(chatMessages.value, 'user_id').map((message) => message.user)
  )

  const handleChatMessageUpdate = async (
    payload: RealtimePostgresChangesPayload<ChatMessage>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        // eslint-disable-next-line no-case-declarations
        const chatUser = await api.getUser(newRecord.user_id!)
        chatMessages.value.push({ ...newRecord, user: chatUser! })
        break
      case 'UPDATE':
        chatMessages.value = chatMessages.value.map((message) => {
          if (message.id === newRecord.id) {
            return { ...message, ...newRecord }
          }
          return message
        })
        break
      case 'DELETE':
        chatMessages.value = chatMessages.value.filter(
          (message) => message.id !== oldRecord.id
        )
        break
      default:
        break
    }
  }
  const subscribeToChatMessages = async (gameId: string) => {
    api.subscribeToChatMessages(gameId, handleChatMessageUpdate)
  }
  const fetchChatMessages = async (gameId: string) => {
    const feed = await api.getChatMessages(gameId)
    chatMessages.value = feed.reverse()
    await subscribeToChatMessages(gameId)
  }

  const sendMessage = async ({
    gameId,
    content,
    userId,
  }: {
    gameId: string
    content: string
    userId: string
  }) => {
    await api.postChatMessage({ gameId, content, userId })
  }

  return {
    sendMessage,
    chatMessages,
    chatUsers,
    fetchChatMessages,
    subscribeToChatMessages,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
