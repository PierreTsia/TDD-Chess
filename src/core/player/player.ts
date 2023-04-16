import type { Color, IBoard, IGame, IMove, IPlayer } from '~/core/types'

export class Player implements IPlayer {
  color: Color
  isHuman: boolean
  name: string

  constructor(color: Color, isHuman = true, name = '') {
    this.color = color
    this.isHuman = isHuman
    this.name = name
  }

  private detectCastlingMove(move: IMove): boolean {
    return (
      move.piece?.type === 'king' &&
      move.endPosition.x - move.startPosition.x !== -1 &&
      move.endPosition.x - move.startPosition.x !== 1 &&
      move.endPosition.y - move.startPosition.y === 0
    )
  }

  private detectEnPassant(move: IMove, board: IBoard): boolean {
    if (move.piece?.type !== 'pawn') {
      return false
    }

    const isOneSquaresVertically =
      Math.abs(move.endPosition.y - move.startPosition.y) === 1

    const isOneSquareHorizontally =
      Math.abs(move.endPosition.x - move.startPosition.x) === 1

    const enPassantArrivalRow = move.piece?.color === 'white' ? 2 : 5

    const isEnPassantArrivalColumn = move.endPosition.y === enPassantArrivalRow

    const isArrivalSquareEmpty = board.isEmptySquare(move.endPosition)

    return (
      isOneSquaresVertically &&
      isOneSquareHorizontally &&
      isEnPassantArrivalColumn &&
      isArrivalSquareEmpty
    )
  }

  private detectPawnPromotion(move: IMove): boolean {
    return (
      move.piece?.type === 'pawn' &&
      ((move.endPosition.y === 0 && move.piece?.color === 'white') ||
        (move.endPosition.y === 7 && move.piece?.color === 'black'))
    )
  }

  makeMove(move: IMove, game: IGame): boolean {
    if (this.detectCastlingMove(move)) {
      move.specialMoveType = 'castling'
    } else if (this.detectPawnPromotion(move)) {
      move.specialMoveType = 'promotion'
    } else if (this.detectEnPassant(move, game.board)) {
      move.specialMoveType = 'en_passant'
    }
    return game.makeMove(move)
  }
}
