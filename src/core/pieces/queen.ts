import type {Color, IBoard, IMove, IPiece, Modifier, PieceType, Position } from "~/core/types";

export class Queen implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  readonly directionOffsets: Array<{ x: Modifier; y: Modifier }> = []

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'queen'
    this.position = position
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    return []
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    return false
  }
}
