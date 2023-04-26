import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import partition from 'lodash/partition'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import type { GameInviteData, OnlineGame } from '~/modules/types/supabase'
import type {
  MultiplayerGameData,
  MultiplayerGameInviteData,
  OnlinePlayer,
} from '~/services/api'
import { SupabaseService } from '~/services/api'
import { useUserStore } from '~/stores/user'

export const useOnlineGamesStore = defineStore('onlineGames', () => {
  const api = new SupabaseService()

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const onlineGames = ref<MultiplayerGameData[]>([])
  const gameInvites = ref<MultiplayerGameInviteData[]>([])

  const sortedInvites = computed(() =>
    partition(gameInvites.value, (invite) => invite?.host_id === user.value?.id)
  )

  const currentGame = ref<MultiplayerGameData | null>(null)
  const registeredPlayers = ref<OnlinePlayer[]>([])
  const connectedPlayersIds = ref<string[]>([])

  const onlineUsers = computed(() =>
    registeredPlayers.value.filter((player) =>
      connectedPlayersIds.value.includes(player.id)
    )
  )

  const availableOpponents = computed(() => {
    return registeredPlayers.value.filter(
      (player) => player.id !== user.value?.id
    )
  })

  const setGameById = async (gameId: string) => {
    const game = await api.getGame(gameId)
    onlineGames.value.unshift(game!)
  }

  const fetchOnlinePlayers = async () => {
    registeredPlayers.value = await api.getUsers()
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
            return { ...game, ...newRecord } as MultiplayerGameData
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

  const addNewInvitation = async (inviteId: string) => {
    const invite = await api.getGameInviteById(inviteId)
    gameInvites.value.unshift(invite!)
  }

  const updateInvitation = (newRecord: GameInviteData) => {
    const existingInviteIndex = gameInvites.value.findIndex(
      (invite) => invite.id === newRecord.id
    )
    if (existingInviteIndex !== -1) {
      const newInvite = {
        ...gameInvites.value[existingInviteIndex],
        ...newRecord,
      } as MultiplayerGameInviteData
      gameInvites.value.splice(existingInviteIndex, 1, newInvite)
    }
  }

  const handleGameInvitationsChange = async (
    payload: RealtimePostgresChangesPayload<GameInviteData>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        await addNewInvitation(newRecord.id)
        break
      case 'DELETE':
        gameInvites.value = gameInvites.value.filter(
          (invite) => invite.id !== oldRecord.id
        )
        break
      case 'UPDATE':
        updateInvitation(newRecord)
        break
    }
  }

  const subscribeToInvitations = () => {
    api.subscribeToGameInvitesFeed(user.value?.id as string, [
      handleGameInvitationsChange,
      handleGameUpdate,
    ])
  }
  const fetchGameInvites = async () => {
    gameInvites.value = await api.getGameInvites(user.value?.id as string)
    subscribeToInvitations()
  }

  const challengeToPlay = async (opponentId: string) => {
    if (!user.value?.id) {
      return
    }

    await api.createGameInvite({
      host_id: user.value.id,
      white_player_id: user.value.id,
      black_player_id: opponentId,
    })
  }

  const setCurrentGame = async (gameId: string) => {
    currentGame.value = await api.getGame(gameId)
  }

  const createGame = async (
    opponentId: string,
    callBack?: (id: string) => void
  ) => {
    const gameId = await api.createGame({
      white_player_id: user.value?.id,
      black_player_id: opponentId,
      status: 'not_started',
    })

    if (callBack) {
      callBack(gameId)
    }
  }

  const createGameFromInvitation = async (
    invitation: MultiplayerGameInviteData
  ) => {
    const gameId = await api.createGame({
      white_player_id: invitation.white_player_id,
      black_player_id: invitation.black_player_id,
      status: 'not_started',
    })

    await api.updateGameInvite(invitation.id, { game_id: gameId })

    return gameId
  }

  const isOnline = (userId: string) => {
    return connectedPlayersIds.value.includes(userId)
  }

  const fetchOnlineGames = async (userId: string) => {
    onlineGames.value = await api.getGames(userId)
  }

  return {
    sortedInvites,
    isOnline,
    onlineUsers,
    connectedPlayersIds,
    fetchOnlinePlayers,
    fetchGameInvites,
    registeredPlayers,
    availableOpponents,
    setCurrentGame,
    fetchOnlineGames,
    createGame,
    onlineGames,
    currentGame,
    gameInvites,
    challengeToPlay,
    subscribeToInvitations,
    createGameFromInvitation,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
