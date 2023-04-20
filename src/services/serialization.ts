import { Board } from '~/core/board/board'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'

import type { IBoard, IPiece } from '~/core/types'
import type { Json } from '~/modules/types/supabase'

export const deserializeBoard = (boardJson: Json): IBoard => {
  interface BoardData {
    squares: Array<Array<IPiece | null>>
  }
  if (!boardJson) {
    return new Board()
  }
  const boardData = JSON.parse(boardJson as string) as BoardData

  if (!boardData?.squares) {
    return new Board()
  }

  const squares = boardData.squares.map((row) => {
    return row.map((pieceData) => {
      if (pieceData === null) {
        return null
      } else {
        const { type, color, position, hasMoved } = pieceData
        const PieceClass = {
          king: King,
          queen: Queen,
          rook: Rook,
          bishop: Bishop,
          knight: Knight,
          pawn: Pawn,
        }[type]

        const piece = new PieceClass(color, position)
        piece.hasMoved = hasMoved

        return piece
      }
    })
  })

  return new Board(squares)
}
