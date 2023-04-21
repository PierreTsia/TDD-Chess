import { Board } from '~/core/board/board'
import { MoveHistory } from '~/core/moves/move-history'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'

import type { IMoveHistory, IPiece } from '~/core/types'
import type { Json } from '~/modules/types/supabase'

interface BoardData {
  squares: Array<Array<IPiece | null>>
}

export const deserializeMoveHistory = (
  moveHistoryPojo: Json | IMoveHistory
): MoveHistory => {
  if (!moveHistoryPojo) {
    return new MoveHistory()
  }

  const moveHistoryData =
    typeof moveHistoryPojo === 'string'
      ? (JSON.parse(moveHistoryPojo as string) as IMoveHistory)
      : (moveHistoryPojo as IMoveHistory)

  return new MoveHistory(moveHistoryData.moves)
}
export const deserializeBoard = (boardJson: Json | BoardData): Board => {
  if (!boardJson) {
    return new Board()
  }
  const boardData =
    typeof boardJson === 'string'
      ? (JSON.parse(boardJson as string) as BoardData)
      : (boardJson as BoardData)

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
