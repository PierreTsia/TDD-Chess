import type { ComputedRef } from 'vue'
import { Game } from '~/core/game/game'
import type { Color,  PieceType } from '~/core/types'

type CapturedMaterial = Record<Color, Record<PieceType, number>>

const game = ref(new Game(['Gary Kasparov', 'Deep Blue']))
export const useChessGame = () => {
  const board = computed(() => game.value.board)
  const currentPlayer = computed(
    () => game.value.currentPlayer
  )
  const status = computed(() => game.value.status)
  const players = computed(() => game.value.players)
  const winner = computed(() => game.value.gameWinner)
  const lastMove = computed(() => game.value.moveHistory.getLastMove())
  const lastCancelledMove = computed(() =>
    game.value.moveHistory.getLastCancelledMove()
  )

  const capturedMaterial: ComputedRef<CapturedMaterial> = computed(() =>
    game.value.capturedPieces.reduce(
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

  const piecesWeight: Record<PieceType, number> = {
    king: 0,
    queen: 9,
    rook: 5,
    bishop: 3,
    knight: 3,
    pawn: 1,
  }

  const materialScore = computed(() => {
    const colors: [Color, Color] = ['white', 'black']
    const [white, black] = colors.flatMap((color: Color) => {
      return Object.entries(capturedMaterial.value[color]).reduce(
        (acc, [pieceType, count]) =>
          acc + piecesWeight[pieceType as PieceType] * count,
        0
      )
    })

    return {
      white,
      black,
    }
  })

  const start = () => {
    game.value.initializeGame()
  }

  const undo = () => game.value.undoMove()
  const redo = () => game.value.redoMove()

  return {
    materialScore,
    players,
    capturedMaterial,
    game,
    board,
    currentPlayer,
    status,
    lastMove,
    lastCancelledMove,
    winner,
    start,
    undo,
    redo,
  }
}
