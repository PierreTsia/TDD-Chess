import { Bishop } from '~/core/pieces/bishop'
import { Rook } from '~/core/pieces/rook'
import type {
  Color,
  IBoard,
  IMove,
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

  getPossibleMoves(board: IBoard): Array<IMove> {
    const bishopMoves = new Bishop(this.color, this.position).getPossibleMoves(
      board
    )
    const rookMoves = new Rook(this.color, this.position).getPossibleMoves(
      board
    )

    return [...bishopMoves, ...rookMoves]
  }
}
