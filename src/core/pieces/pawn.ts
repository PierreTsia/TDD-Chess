import { Piece } from '~/core/pieces/piece'
import type { Color, IBoard, Modifier, PieceType, Position } from '~/core/types'

export class Pawn extends Piece {
  type: PieceType

  hasMoved = false
  directionOffsets: Array<{ x: Modifier; y: Modifier }> = []

  constructor(color: Color, position: Position) {
    super(color, position)
    this.type = 'pawn'
  }

  get modifier() {
    return this.color === 'white' ? -1 : 1
  }

  getMoveSquares(board: IBoard): Array<Position> {
    return [
      ...this.verticalMoveSquares(board),
      ...this.diagonalMoveSquares(board),
    ]
  }

  private diagonalMoveSquares(board: IBoard): Array<Position> {
    const { x, y } = this.position
    const diagonalLeft = { x: x - 1, y: y + this.modifier } as Position
    const diagonalRight = { x: x + 1, y: y + this.modifier } as Position
    return [diagonalRight, diagonalLeft].filter(
      (p) => board.isEnemyPieceAt(p, this.color) && !board.isOutOfBounds(p)
    )
  }

  private verticalMoveSquares(board: IBoard): Array<Position> {
    const { x, y } = this.position

    const possibleSquares = [{ x, y: y + this.modifier } as Position]
    if (!this.hasMoved) {
      possibleSquares.push({ x, y: y + this.modifier * 2 } as Position)
    }
    return possibleSquares.filter(
      (p) => board.isEmptySquare(p) && !board.isOutOfBounds(p)
    )
  }
}
