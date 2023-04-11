import type { Position } from '@vueuse/core'
import type { IBoard, IMove, IPiece, SpecialMoveType } from '~/core/types'

export class Move implements IMove {
  piece: IPiece
  startPosition: Position

  endPosition: Position

  specialMoveType: SpecialMoveType | null

  constructor(
    piece: IPiece,
    startPosition: Position,
    endPosition: Position,
    specialMoveType: SpecialMoveType | null = null
  ) {
    this.piece = piece
    this.startPosition = startPosition
    this.endPosition = endPosition
    this.specialMoveType = specialMoveType
  }

  isValid(board: IBoard): boolean {
    return this.piece?.canMoveTo(this.endPosition, board)
  }
}
