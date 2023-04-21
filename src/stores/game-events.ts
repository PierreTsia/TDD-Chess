import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { useChatStore } from '~/stores/chat'
import { useGamePlayStore } from '~/stores/game-play'
import supabase from '~/modules/supabase'
import type {
  ChatMessage,
  GameState,
  OnlineGame,
} from '~/modules/types/supabase'

const POSTGRES_CHANGES = 'postgres_changes'

export const useGameEventsStore = defineStore('gameEvents', () => {
  const chatStore = useChatStore()
  const gamePlayStore = useGamePlayStore()

  const gameId = ref<string | null>(null)

  const setGameId = (id: string) => {
    gameId.value = id
  }

  const isMultiPlayer = computed(() => !!gameId.value)

  const subscribeToGameEvents = () => {
    if (!gameId.value) {
      return
    }
    supabase
      .channel('schema-db-changes')
      .on(
        POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          await chatStore.handleChatMessageUpdate(payload)
        }
      )
      .on(
        POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        async (payload: RealtimePostgresChangesPayload<OnlineGame>) => {
          await gamePlayStore.handleGameUpdate(payload)
        }
      )
      .on(
        POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'game_states',
          filter: `game_id=eq.${gameId.value}`,
        },
        async (payload: RealtimePostgresChangesPayload<GameState>) => {
          await gamePlayStore.handleGameStateUpdate(payload)
        }
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to Game Events:', payload)
      })
  }

  return { isMultiPlayer, setGameId, subscribeToGameEvents }
})
