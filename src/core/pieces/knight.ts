import { Move } from '~/core/moves/move'
import { Piece } from '~/core/pieces/piece'
import type {
  Color,
  IBoard,
  IMove,
  Modifier,
  PieceType,
  Position,
} from '~/core/types'

export class Knight extends Piece {
  type: PieceType

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
  ]

  constructor(color: Color, position: Position) {
    super(color, position)
    this.type = 'knight'
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

  getPossibleMoves(board: IBoard): Array<IMove> {
    const moveSquares = this.getMoveSquares(board)

    return moveSquares.map(
      (position) => new Move(this, this.position, position)
    )
  }
}
