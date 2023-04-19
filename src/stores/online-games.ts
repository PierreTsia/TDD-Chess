import { acceptHMRUpdate, defineStore } from 'pinia'
import supabase from '~/modules/supabase'
import type { OnlineGame } from '~/modules/types/supabase'

export type MultiplayerGame = OnlineGame & {
  white_player: { username: string; id: string; email: string }
  black_player: { username: string; id: string; email: string }
}

export const useOnlineGames = defineStore('onlineGames', () => {
  const onlineGames = ref<MultiplayerGame[]>([])

  const fetchGameDetails = async (gameId: string) => {
    const { data } = await supabase
      .from('games')
      .select(
        `
      *,
      white_player: white_player_id (
        username,
        id,
        email
      ),
      black_player: black_player_id (
        username,
        id,
        email

      )
    `
      )
      .eq('id', gameId)

    if (data) {
      return data[0] as MultiplayerGame
    }
  }
  const subscribeToOnlineGames = async () => {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          switch (eventType) {
            case 'INSERT':
              // eslint-disable-next-line no-case-declarations
              const game = await fetchGameDetails(newRecord.id)
              onlineGames.value.unshift(game!)
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
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Status is:', payload)
      })
  }

  const fetchOnlineGames = async (userId: string) => {
    const { data } = await supabase
      .from('games')
      .select(
        `
      *,
      white_player: white_player_id (
        username,
        id
      ),
      black_player: black_player_id (
        username,
        id

      )
    `
      )
      .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (data) {
      onlineGames.value = data as MultiplayerGame[]
    }

    await subscribeToOnlineGames()
  }

  return {
    fetchOnlineGames,
    onlineGames,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
