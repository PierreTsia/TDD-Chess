import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ComputedRef } from 'vue'
import { PIECES_WEIGHT } from '~/core/constants'
import { Game } from '~/core/game/game'
import type { Color, IGame, PieceType } from '~/core/types'
import type { MultiplayerGameState } from '~/services/api'
import { SupabaseService } from '~/services/api'
import { deserializeBoard } from '~/services/serialization'

type CapturedMaterial = Record<Color, Record<PieceType, number>>
export const useGamePlayStore = defineStore('gamePlay', () => {
  const api = new SupabaseService()
  const playersNames = ref<[string, string]>(['Gary Kasparov', 'Deep Blue'])
  const gameState = ref<MultiplayerGameState | null>(null)
  const gameEngine = ref<IGame>(new Game(playersNames.value))
  const board = computed(() => gameEngine.value.board)

  const isBlackPov = ref(false)
  const currentPlayer = computed(() => gameEngine.value.currentPlayer)
  const status = computed(() => gameEngine.value.status)
  const players = computed(() => gameEngine.value.players)
  const winner = computed(() => gameEngine.value.gameWinner)
  const lastMove = computed(() => gameEngine.value.moveHistory.getLastMove())
  const lastCancelledMove = computed(() =>
    gameEngine.value.moveHistory.getLastCancelledMove()
  )
  const setGameState = async (gameId: string) => {
    const existingGameState = await api.getGameState(gameId)

    gameEngine.value = new Game(playersNames.value)

    if (existingGameState) {
      // @ts-expect-error will see later
      gameState.value = existingGameState

      gameEngine.value.board = deserializeBoard(gameState.value.board)
    } else {
      gameEngine.value.initializeGame()
      const board = JSON.stringify(gameEngine.value.board)

      await api.createGameState(gameId, board)
    }
  }
  const initOnlineGame = async (gameId: string) => {
    const game = await api.getGame(gameId)
    if (!game) {
      return
    }
    playersNames.value = [
      game.white_player.username,
      game.black_player.username,
    ]
    await setGameState(gameId)
  }

  const switchPoV = () => {
    isBlackPov.value = !isBlackPov.value
  }

  const capturedMaterial: ComputedRef<CapturedMaterial> = computed(() =>
    gameEngine.value.capturedPieces.reduce(
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
    setGameState,
    gameState,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
