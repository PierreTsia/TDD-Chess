import { isEqual } from 'lodash'
import { Move } from '~/core/moves/move'
import type {
  Color,
  IBoard,
  IMove,
  IPiece,
  PieceType,
  Position,
} from '~/core/types'

export class Knight implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'knight'
    this.position = position
  }

  private getMoveOffsets(): Array<[number, number]> {
    return [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ]
  }

  private getMoveSquares(): Array<Position> {
    const { x, y } = this.position
    return this.getMoveOffsets().map(
      ([dx, dy]) => ({ x: x + dx, y: y + dy } as Position)
    )
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    const moveSquares = this.getMoveSquares()

    return moveSquares
      .filter(
        (position) =>
          !board.isOutOfBounds(position) &&
          (board.isEmptySquare(position) ||
            board.isEnemyPieceAt(position, this.color))
      )
      .map((position) => new Move(this, this.position, position))
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    const possibleMoves = this.getPossibleMoves(board)
    return possibleMoves.some((move) => isEqual(move.endPosition, position))
  }
}
