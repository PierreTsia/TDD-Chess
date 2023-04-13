import type { Color, IGame, IMove, IPlayer } from '~/core/types'

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

  makeMove(move: IMove, game: IGame): boolean {
    if (this.detectCastlingMove(move)) {
      move.specialMoveType = 'castling'
    }
    return game.makeMove(move)
  }
}
