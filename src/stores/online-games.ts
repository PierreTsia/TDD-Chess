import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { OnlineGame } from '~/modules/types/supabase'
import type { MultiplayerGame } from '~/services/api'
import { SupabaseService } from '~/services/api'

export const useOnlineGamesStore = defineStore('onlineGames', () => {
  const api = new SupabaseService()

  const onlineGames = ref<MultiplayerGame[]>([])
  const currentGame = ref<MultiplayerGame | null>(null)

  const setGameById = async (gameId: string) => {
    const game = await api.getGame(gameId)
    onlineGames.value.unshift(game!)
  }

  const setCurrentGame = async (gameId: string) => {
    currentGame.value = await api.getGame(gameId)
  }

  const handleGameUpdate = async (
    payload: RealtimePostgresChangesPayload<OnlineGame>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        await setGameById(newRecord.id)
        break
      case 'UPDATE':
        onlineGames.value = onlineGames.value.map((game) => {
          if (game.id === newRecord.id) {
            return { ...game, ...newRecord } as MultiplayerGame
          }
          return game
        })
        break
      case 'DELETE':
        onlineGames.value = onlineGames.value.filter(
          (game) => game.id !== oldRecord.id
        )
        break
      default:
        break
    }
  }

  const subscribeToOnlineGames = async () => {
    api.subscribeToGamesFeed(handleGameUpdate)
  }

  const fetchOnlineGames = async (userId: string) => {
    onlineGames.value = await api.getGames(userId)

    await subscribeToOnlineGames()
  }

  return {
    setCurrentGame,
    fetchOnlineGames,
    onlineGames,
    currentGame,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
