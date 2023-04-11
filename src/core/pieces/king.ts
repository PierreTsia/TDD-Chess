import type { Color, IBoard, IMove, IPiece, PieceType, Position } from '~/core/types'

export class King implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'king'
    this.position = position
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    return []
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    return false
  }
}
