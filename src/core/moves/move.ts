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

  private castlingPathIsClear(board: IBoard): boolean {
    const { x, y } = this.endPosition
    const isKingSide = x === 6

    const [min, max] = isKingSide ? [5, 6] : [1, 3]
    const opponentColor = this.piece.color === 'white' ? 'black' : 'white'
    for (let i = min; i <= max; i++) {
      const pos = { x: i, y } as Position
      if (
        !board.isEmptySquare(pos) ||
        board.isPositionUnderAttack(pos, opponentColor)
      ) {
        return false
      }
    }
    return true
  }

  private kingHasNotMoved(): boolean {
    return this.piece.type === 'king' && !this.piece.hasMoved
  }

  private isCastlingValid(board: IBoard): boolean {
    const isOccupied = !!board.getPieceAt(this.endPosition)?.type
    const isEndSquareCorrect =
      this.endPosition.x === 6 || this.endPosition.x === 2
    return (
      isEndSquareCorrect &&
      !isOccupied &&
      this.kingHasNotMoved() &&
      this.isRookCastlingValid(board, this.piece?.color) &&
      this.castlingPathIsClear(board)
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
