import type { Position } from '@vueuse/core'
import type { Color, IBoard, IMove, IPiece, PieceType } from '~/core/types'

export class Queen implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'queen'
    this.position = position
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    return []
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    return false
  }
}
