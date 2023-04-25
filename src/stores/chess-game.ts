import { defineStore } from 'pinia'
import type { ComputedRef } from 'vue'
import { PIECES_WEIGHT } from '~/core/constants'
import { Game } from '~/core/game/game'
import { Player } from '~/core/player/player'
import type { Color, IGame , IMove, IPlayer, PieceType } from '~/core/types'
type CapturedMaterial = Record<Color, Record<PieceType, number>>

export const useChessGameStore = defineStore('chessGame', () => {
  const players = ref<[IPlayer, IPlayer]>([
    new Player('white', true, 'Deep Blue', '2'),
    new Player('black', true, 'Gary Kasparov', '3'),
  ])

  const gameEngine = ref<IGame>(new Game(players.value))
  const board = computed(() => gameEngine.value.board)
  const moveHistory = computed<Array<IMove>>(
    () => gameEngine.value.moveHistory.moves
  )
  const isBlackPov = ref(false)
  const currentPlayer = computed(() => gameEngine.value.currentPlayer)
  const status = computed(() => gameEngine.value.status)
  const winner = computed(() => gameEngine.value.gameWinner)
  const lastMove = computed(() => gameEngine.value.moveHistory.getLastMove())
  const lastCancelledMove = computed(() =>
    gameEngine.value.moveHistory.getLastCancelledMove()
  )

  const isGameOver = computed(() =>
    ['checkmate', 'draw', 'resigned'].includes(status.value)
  )

  const initSoloGame = () => {
    gameEngine.value = new Game(players.value)
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
    players,
    gameEngine,
    board,
    moveHistory,
    isBlackPov,
    currentPlayer,
    status,
    winner,
    lastMove,
    lastCancelledMove,
    isGameOver,
    materialScore,
    initSoloGame,
    start,
    undo,
    redo,
  }
})
