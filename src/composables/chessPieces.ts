import type { defineComponent } from 'vue'
import type {Color, IBoard, PieceType, Position } from '~/core/types'
import {
  BishopBlack,
  BishopWhite,
  KingBlack,
  KingWhite,
  KnightBlack,
  KnightWhite,
  PawnBlack,
  PawnWhite,
  QueenBlack,
  QueenWhite,
  RookBlack,
  RookWhite,
} from '~/components/chess/pieces/index'

type PiecesMap = Record<
  PieceType,
  Record<Color, ReturnType<typeof defineComponent>>
>

export const useChessPieces = () => {
  const pieces: PiecesMap = {
    bishop: {
      black: BishopBlack,
      white: BishopWhite,
    },
    king: {
      black: KingBlack,
      white: KingWhite,
    },
    knight: {
      black: KnightBlack,
      white: KnightWhite,
    },
    pawn: {
      black: PawnBlack,
      white: PawnWhite,
    },
    queen: {
      black: QueenBlack,
      white: QueenWhite,
    },
    rook: {
      black: RookBlack,
      white: RookWhite,
    },
  }

  const chessPiece = ({ x, y }: Position, board: IBoard) => {
    const piece = board.squares[y][x]
    if (!piece) {
      return null
    }
    return pieces[piece.type][piece.color]
  }

  return { chessPiece }
}
