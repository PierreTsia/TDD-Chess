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

  capturedPiece: IPiece | null = null

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
    const opponentColor = this.piece.getOppositeColor()
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

  isCastlingValid(board: IBoard): boolean {
    const isOccupied = !!board.getPieceAt(this.endPosition)?.type
    const isEndSquareCorrect = [6, 2].includes(this.endPosition.x)

    return (
      isEndSquareCorrect &&
      !isOccupied &&
      this.kingHasNotMoved() &&
      this.isRookCastlingValid(board, this.piece?.color) &&
      this.castlingPathIsClear(board)
    )
  }

  private isEnPassantValid(lastMove: IMove): boolean {

    const isLastMovePawn = lastMove?.piece?.type === 'pawn'
    const isLastMovePawnTwoSquares =
      Math.abs(lastMove?.endPosition.y - lastMove?.startPosition.y) === 2
    const isLastMovePawnOppositeColor =
      lastMove?.piece?.color !== this.piece?.color
    const isCorrectRow = lastMove.piece?.color === 'white' ? 4 : 3
    const isLastMoveNextTo =
      Math.abs(lastMove?.endPosition.x - this.startPosition.x) === 1
    const isLastMoveSameColumn = lastMove?.endPosition.x === this.endPosition.x

    return (
      isLastMovePawn &&
      isLastMovePawnTwoSquares &&
      isLastMovePawnOppositeColor &&
      isCorrectRow &&
      isLastMoveNextTo &&
      isLastMoveSameColumn
    )
  }

  isValid(board: IBoard, lastMove: IMove): boolean {
    switch (this.specialMoveType) {
      case 'en_passant':
        return this.isEnPassantValid(lastMove)
      case 'castling':
        return this.isCastlingValid(board)
      default:
        return this.piece?.canMoveTo(this.endPosition, board)
    }
  }
}
