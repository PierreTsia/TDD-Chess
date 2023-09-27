import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Ref } from 'vue'
import uniqBy from 'lodash/uniqBy'
import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia'
import type { ChatMessage } from '~/modules/types/supabase'
import type { GameChatMessage } from '~/services/api'
import { SupabaseService } from '~/services/api'
import {useUserStore} from "~/stores/user";

export const useChatStore = defineStore('chat', () => {
  const api = new SupabaseService()
  const userStore = useUserStore()

  const { user } = storeToRefs(userStore)

  const messageFeed: Ref<Record<string, GameChatMessage[]>> = ref({})
  const unreadMessagesCount: Ref<Record<string, number>> = ref({})

  const activeGameId = ref<string | null>(null)

  const gameMessages = computed(() => {
    if (!activeGameId.value) {
      return []
    }
    return messageFeed.value[activeGameId.value]
  })
  const setActiveGameId = (gameId: string) => (activeGameId.value = gameId)

  const chatUsers = computed(() =>
    uniqBy(gameMessages.value, 'user_id').map((message) => message.user)
  )

  const addNewMessage = async (newMessage: ChatMessage) => {
    const gameId = newMessage.game_id!
    const chatUser = await api.getUser(newMessage.user_id!)
    messageFeed.value[gameId].push({
      ...newMessage,
      user: chatUser!,
    })
    if (user.value?.id !== newMessage.user_id) {
      unreadMessagesCount.value[gameId] =
          (unreadMessagesCount.value[gameId] || 0) + 1
    }
  }

  const readMessages = (gameId: string) => {
    unreadMessagesCount.value[gameId] = 0
  }

  const handleChatMessageUpdate = async (
    payload: RealtimePostgresChangesPayload<ChatMessage>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    if (!activeGameId.value) {
      return
    }
    switch (eventType) {
      case 'INSERT':
        await addNewMessage(newRecord)
        break
      case 'UPDATE':
        messageFeed.value[activeGameId.value] = messageFeed.value[
          activeGameId.value
        ].map((message) => {
          if (message.id === newRecord.id) {
            return { ...message, ...newRecord }
          }
          return message
        })
        break
      case 'DELETE':
        messageFeed.value[activeGameId.value] = messageFeed.value[
          activeGameId.value
        ].filter((message) => message.id !== oldRecord.id)
        break
      default:
        break
    }
  }

  const fetchChatMessages = async (gameId: string) => {
    setActiveGameId(gameId)
    const feed = await api.getChatMessages(gameId)
    messageFeed.value[gameId] = feed.reverse()
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
    activeGameId,
    setActiveGameId,
    sendMessage,
    messageFeed,
    unreadMessagesCount,
    readMessages,
    chatUsers,
    fetchChatMessages,
    gameMessages,
    handleChatMessageUpdate,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
