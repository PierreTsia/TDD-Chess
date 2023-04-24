import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import type { PresenceRef} from '~/services/api';
import { SupabaseService } from '~/services/api'
import { useChatStore } from '~/stores/chat'
import { useGamePlayStore } from '~/stores/game-play'

import type {
  ChatMessage,
  GameState,
  OnlineGame,
} from '~/modules/types/supabase'

export const useGameEventsStore = defineStore('gameEvents', () => {
  const chatStore = useChatStore()
  const gamePlayStore = useGamePlayStore()
  const onlineUsers = ref<PresenceRef[]>([])

  const gameId = ref<string | null>(null)

  const api = new SupabaseService()

  const setGameId = (id: string) => {
    gameId.value = id
  }

  const subscribeToPresence = (gameId: string, userId: string) => {
    api.subscribeToPlayersPresence(gameId, userId, (users: PresenceRef[]) => {
      onlineUsers.value = users
    })
  }

  const unsubscribeFromPresence = (gameId: string, userId:string) => {
    api.unsubscribeFromPlayersPresence(gameId, userId)
  }



  const isMultiPlayer = computed(() => !!gameId.value)

  const handleChatMessageUpdate = async (
    payload: RealtimePostgresChangesPayload<ChatMessage>
  ) => {
    await chatStore.handleChatMessageUpdate(payload)
  }

  const handleGameUpdate = async (
    payload: RealtimePostgresChangesPayload<OnlineGame>
  ) => {
    await gamePlayStore.handleGameUpdate(payload)
  }

  const handleGameStateUpdate = async (
    payload: RealtimePostgresChangesPayload<GameState>
  ) => {
    await gamePlayStore.handleGameStateUpdate(payload)
  }

  const subscribeToGameEvents = () => {
    if (!gameId.value) {
      return
    }

    api.subscribeToGameEvents(gameId.value, [
      handleChatMessageUpdate,
      handleGameUpdate,
      handleGameStateUpdate,
    ])
  }

  return {
    isMultiPlayer,
    onlineUsers,
    setGameId,
    subscribeToGameEvents,
    subscribeToPresence,
    unsubscribeFromPresence,
  }
})
