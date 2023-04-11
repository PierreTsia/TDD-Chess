import type { Color, Modifier, PieceType, Position } from '~/core/types'

import { Piece } from '~/core/pieces/piece'

export class Bishop extends Piece {
  type: PieceType

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ]

  constructor(color: Color, position: Position) {
    super(color, position)

    this.type = 'bishop'
  }

}
