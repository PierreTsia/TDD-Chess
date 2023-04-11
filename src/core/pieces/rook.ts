import { Piece } from '~/core/pieces/piece'
import type { Color, Modifier, PieceType, Position } from '~/core/types'

export class Rook extends Piece {
  type: PieceType

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]

  constructor(color: Color, position: Position) {
    super(color, position)
    this.type = 'rook'
  }
}
