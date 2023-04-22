import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { PIECES_WEIGHT } from '~/core/constants'
import { Game } from '~/core/game/game'
import { Player } from '~/core/player/player'
import type { Color, GameStatus, IGame, IPlayer, PieceType } from '~/core/types'
import type { GameState, OnlineGame } from '~/modules/types/supabase'
import type { MultiplayerGame, MultiplayerGameState } from '~/services/api'
import { SupabaseService } from '~/services/api'
import {
  deserializeBoard,
  deserializeMoveHistory,
} from '~/services/serialization'

type CapturedMaterial = Record<Color, Record<PieceType, number>>
export const useGamePlayStore = defineStore('gamePlay', () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const myId = computed(() => user.value?.id)
  const api = new SupabaseService()

  const players = ref<[IPlayer, IPlayer]>([
    new Player('white', true, 'Deep Blue', '2'),
    new Player('black', true, 'Gary Kasparov', '3'),
  ])
  const gameState = ref<MultiplayerGameState | null>(null)
  const gameEngine = ref<IGame>(new Game(players.value))
  const board = computed(() => gameEngine.value.board)
  const me = computed(() =>
    gameEngine.value.players.find((p) => p.id === myId.value)
  )

  const isBlackPov = ref(false)
  const currentPlayer = computed(() => gameEngine.value.currentPlayer)
  const status = computed(() => gameEngine.value.status)
  const winner = computed(() => gameEngine.value.gameWinner)
  const lastMove = computed(() => gameEngine.value.moveHistory.getLastMove())
  const lastCancelledMove = computed(() =>
    gameEngine.value.moveHistory.getLastCancelledMove()
  )

  const handleGameUpdate = (
    payload: RealtimePostgresChangesPayload<OnlineGame>
  ) => {
    if (payload.eventType === 'UPDATE') {
      gameEngine.value.status = payload.new.status as GameStatus
    }
  }

  const handleGameStateUpdate = (
    payload: RealtimePostgresChangesPayload<GameState>
  ) => {
    if (payload.eventType === 'UPDATE') {
      gameEngine.value.board = deserializeBoard(payload.new.board)
      gameEngine.value.moveHistory = deserializeMoveHistory(
        payload.new.move_history
      )

      const myOpponentJustPlayed = payload.new.current_player_id === myId.value

      if (myOpponentJustPlayed) {
        gameEngine.value.switchPlayer()
      }
    }
  }

  const initGameEngine = async (game: MultiplayerGame) => {
    const existingGameState = await api.getGameState(game.id)
    players.value = [
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

    gameEngine.value = new Game(players.value, api, game.id)
    const winner: IPlayer | undefined = players.value.find(
      (player) => player.id === game.winner_id
    )

    gameEngine.value.gameWinner = winner ?? null

    if (existingGameState) {
      gameEngine.value.board = deserializeBoard(existingGameState.board)
      gameEngine.value.moveHistory = deserializeMoveHistory(
        existingGameState.move_history
      )
      gameEngine.value.status = game.status as GameStatus
      const currentPlayer = players.value.find(
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

  const startOnlineGame = async () => {
    if (!players.value[0] || !players.value[1]) {
      return
    }
    gameEngine.value.startGame()
  }
  const initOnlineGame = async (gameId: string) => {
    const game = await api.getGame(gameId)
    if (!game) {
      return
    }

    await initGameEngine(game)
  }

  const switchPoV = () => {
    isBlackPov.value = !isBlackPov.value
  }

  const capturedMaterial: ComputedRef<CapturedMaterial> = computed(() =>
    (gameEngine.value?.capturedPieces ?? []).reduce(
      (acc, piece) => {
        if (!acc[piece.color][piece.type]) {
          acc[piece.color][piece.type] = 1
        } else {
          acc[piece.color][piece.type]++
        }
        return acc
      },
      {
        white: {},
        black: {},
      } as CapturedMaterial
    )
  )

  const materialScore = computed(() => {
    const colors: [Color, Color] = ['white', 'black']
    const [white, black] = colors.flatMap((color: Color) => {
      return Object.entries(capturedMaterial.value[color]).reduce(
        (acc, [pieceType, count]) =>
          acc + PIECES_WEIGHT[pieceType as PieceType] * count,
        0
      )
    })

    return {
      white,
      black,
    }
  })

  const start = () => {
    gameEngine.value.initializeGame()
  }

  const undo = () => gameEngine.value.undoMove()
  const redo = () => gameEngine.value.redoMove()

  return {
    me,
    gameEngine,
    board,
    currentPlayer,
    status,
    players,
    winner,
    lastMove,
    lastCancelledMove,
    initOnlineGame,
    start,
    undo,
    redo,
    switchPoV,
    materialScore,
    capturedMaterial,
    isBlackPov,
    initGameEngine,
    startOnlineGame,
    gameState,
    handleGameUpdate,
    handleGameStateUpdate,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
