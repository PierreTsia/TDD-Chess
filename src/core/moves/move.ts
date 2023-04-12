import type {
  Color,
  IBoard,
  IMove,
  IPiece,
  Position,
  SpecialMoveType,
} from '~/core/types'

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

  private isRookCastlingValid(board: IBoard, kingColor: Color): boolean {
    const rook = board.getPieceAt({
      x: this.endPosition.x === 6 ? 7 : 0,
      y: this.endPosition.y,
    } as Position)

    return (
      !!rook &&
      rook.type === 'rook' &&
      !rook?.hasMoved &&
      rook?.color === kingColor
    )
  }

  private isCastlingValid(board: IBoard): boolean {
    const isOccupied = !!board.getPieceAt(this.endPosition)?.type
    return (
      this.piece.type === 'king' &&
      !this.piece.hasMoved &&
      !isOccupied &&
      this.isRookCastlingValid(board, this.piece?.color)
    )
  }

  isValid(board: IBoard): boolean {
    switch (this.specialMoveType) {
      case 'en_passant':
        return false
      case 'promotion':
        return false
      case 'castling':
        return this.isCastlingValid(board)
      default:
        return this.piece?.canMoveTo(this.endPosition, board)
    }
  }
}
