import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { defineStore, storeToRefs } from 'pinia'

import { MultiplayerGameEngine } from '~/core/game/online-game'
import { Player } from '~/core/player/player'
import type { GameStatus, IPlayer } from '~/core/types'
import type { GameState, OnlineGame } from '~/modules/types/supabase'
import type { MultiplayerGameData } from '~/services/api'
import { SupabaseService } from '~/services/api'
import {
  deserializeBoard,
  deserializeMoveHistory,
} from '~/services/serialization'
import { useChessGameStore } from '~/stores/chess-game'
import { useUserStore } from '~/stores/user'

import { useChessBoard } from '~/composables/chessBoard'

export const useMultiplayerChessGameStore = defineStore(
  'multiplayerChessGame',
  () => {
    const chessGameStore = useChessGameStore()
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const { playSound } = useChessBoard()

    const {
      players,

      board,
      currentPlayer,
      moveHistory,
      status,
      lastMove,
      isGameOver,
      gameEngine,
      winner,
      materialScore,
    } = storeToRefs(chessGameStore)
    const myId = computed(() => user.value?.id)
    const api = new SupabaseService()
    const me = computed(() =>
      gameEngine.value?.players.find((p) => p.id === myId.value)
    )
    const mePlaysBlack = computed(() => me.value?.color === 'black')

    const onlinePlayers = ref<[IPlayer, IPlayer]>(players.value)

    const setPlayers = (game: MultiplayerGameData) => {
      onlinePlayers.value = [
        new Player(
          'white',
          true,
          game.white_player.username,
          game.white_player_id!
        ),
        new Player(
          'black',
          true,
          game.black_player.username,
          game.black_player_id!
        ),
      ]
    }

    const initGameEngine = async (game: MultiplayerGameData) => {
      const existingGameState = await api.getGameState(game.id)
      setPlayers(game)

      gameEngine.value = new MultiplayerGameEngine(
        onlinePlayers.value!,
        api,
        game.id
      )
      const winner: IPlayer | undefined = onlinePlayers.value!.find(
        (player) => player.id === game.winner_id
      )

      gameEngine.value.gameWinner = winner ?? null

      if (existingGameState) {
        gameEngine.value.board = deserializeBoard(existingGameState.board)
        gameEngine.value.moveHistory = deserializeMoveHistory(
          existingGameState.move_history
        )
        gameEngine.value.status = game.status as GameStatus
        const currentPlayer = onlinePlayers.value!.find(
          (player) => player.id === existingGameState.current_player_id
        )
        gameEngine.value.currentPlayer =
          currentPlayer ?? gameEngine.value.players[0]
      } else {
        gameEngine.value.initializeGame()
        const board = JSON.stringify(gameEngine.value.board)
        await api.createGameState(game.id, board)
      }
    }
    const initOnlineGame = async (gameId: string) => {
      const game = await api.getGame(gameId)
      if (!game) {
        return
      }

      await initGameEngine(game)
    }

    const resignGame = async () => {
      const winnerId = mePlaysBlack.value
        ? onlinePlayers.value![0].id
        : onlinePlayers.value![1].id
      await api.updateGame({
        id: (gameEngine.value as MultiplayerGameEngine).gameId,
        winner_id: winnerId,
        status: 'resigned',
      })
    }

    const handleGameStateUpdate = (
      payload: RealtimePostgresChangesPayload<GameState>
    ) => {
      if (payload.eventType === 'UPDATE') {
        gameEngine.value!.board = deserializeBoard(payload.new.board)
        gameEngine.value!.moveHistory = deserializeMoveHistory(
          payload.new.move_history
        )
        const lastMove = gameEngine.value!.moveHistory.getLastMove()
        if (lastMove) {
          playSound(lastMove)
        }

        gameEngine.value!.currentPlayer = onlinePlayers.value!.find(
          (player) => player.id === payload.new.current_player_id
        )!

        gameEngine.value!.updateStatus()

        /* TODO hack to propagate status change
         *
         * Otherwise the persist move function in Multiplayer games
         * evaluates checks and checkmates too early
         *
         *  */

        if (payload.new.game_id) {
          api
            .updateGame({
              id: payload.new.game_id as string,
              winner_id: gameEngine.value!.gameWinner?.id,
              status: gameEngine.value!.status,
            })
            .then(() => {
              // eslint-disable-next-line no-console
              console.log('game updated')
            })
        }
      }
    }

    const handleGameUpdate = (
      payload: RealtimePostgresChangesPayload<OnlineGame>
    ) => {
      if (payload.eventType === 'UPDATE') {
        gameEngine.value!.gameWinner =
          onlinePlayers.value?.find(
            (player) => player.id === payload.new.winner_id
          ) ?? null
      }
    }

    return {
      materialScore,
      lastMove,
      moveHistory,
      me,
      board,
      status,
      currentPlayer,
      gameEngine,
      onlinePlayers,
      setPlayers,
      myId,
      mePlaysBlack,
      initOnlineGame,
      handleGameStateUpdate,
      handleGameUpdate,
      resignGame,
      isGameOver,
      winner,
    }
  }
)
