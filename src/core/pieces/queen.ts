import { Bishop } from '~/core/pieces/bishop'
import { Rook } from '~/core/pieces/rook'
import type {
  Color,
  IBoard,
  Modifier,
  PieceType,
  Position,
} from '~/core/types'
import { Piece } from '~/core/pieces/piece'

export class Queen extends Piece {
  type: PieceType

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = []

  constructor(color: Color, position: Position) {
    super(color, position)
    this.type = 'queen'
  }

  getMoveSquares(board: IBoard): Array<Position> {
    const bishopMoves = new Bishop(this.color, this.position).getMoveSquares(
      board
    )
    const rookMoves = new Rook(this.color, this.position).getMoveSquares(board)

    return [...bishopMoves, ...rookMoves]
  }
}
