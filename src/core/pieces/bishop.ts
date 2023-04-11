import { isEqual } from 'lodash'
import { BOARD_SIZE } from '~/core/constants'
import { Move } from '~/core/moves/move'
import type {
  Color,
  IBoard,
  IMove,
  IPiece,
  PieceType,
  Position,
} from '~/core/types'

export class Bishop implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  private directionOffsets = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ]

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'bishop'
    this.position = position
  }

  private getDiagonalMoves(board: IBoard): Array<Position> {
    const moves: Array<Position> = []

    for (const direction of this.directionOffsets) {
      let currentX = this.position.x + direction.x
      let currentY = this.position.y + direction.y

      while (
        currentX >= 0 &&
        currentX < BOARD_SIZE &&
        currentY >= 0 &&
        currentY < BOARD_SIZE
      ) {
        const currentPosition = { x: currentX, y: currentY }
        const pieceAtPosition = board.getPieceAt(currentPosition as Position)

        if (!pieceAtPosition) {
          moves.push(currentPosition as Position)
          currentX += direction.x
          currentY += direction.y
        } else if (pieceAtPosition.color !== this.color) {
          moves.push(currentPosition as Position)
          break
        } else {
          break
        }
      }
    }

    return moves
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    // const diagonalMoves = [] // this.getDiagonalMoves(board)

    return this.getDiagonalMoves(board).map(
      (position) => new Move(this, this.position, position)
    )
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    const possibleMoves = this.getPossibleMoves(board)
    return possibleMoves.some((move) => isEqual(move.endPosition, position))
  }
}
