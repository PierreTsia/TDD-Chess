import { acceptHMRUpdate, defineStore } from 'pinia'
import supabase from '~/modules/supabase'
import type { OnlineGame } from '~/modules/types/supabase'

export const useOnlineGames = defineStore('onlineGames', () => {
  const onlineGames = ref<OnlineGame[]>([])
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
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          switch (eventType) {
            case 'INSERT':
              onlineGames.value.push(newRecord as OnlineGame)
              break
            case 'UPDATE':
              onlineGames.value = onlineGames.value.map((game) => {
                if (game.id === newRecord.id) {
                  return newRecord as OnlineGame
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
        username
      ),
      black_player: black_player_id (
        username
      )
    `
      )
      .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)

    if (data) {
      onlineGames.value = data
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
