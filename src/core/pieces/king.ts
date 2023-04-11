import { Piece } from '~/core/pieces/piece'
import type { Color, IBoard, Modifier, PieceType, Position } from '~/core/types'

export class King extends Piece {
  type: PieceType

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ]

  constructor(color: Color, position: Position) {
    super(color, position)
    this.type = 'king'
  }

  getMoveSquares(board: IBoard): Array<Position> {
    const { x, y } = this.position
    return this.directionOffsets
      .map(({ x: dx, y: dy }) => ({ x: x + dx, y: y + dy } as Position))
      .filter(
        (position) =>
          !board.isOutOfBounds(position) &&
          (board.isEmptySquare(position) ||
            board.isEnemyPieceAt(position, this.color))
      )
  }
}
