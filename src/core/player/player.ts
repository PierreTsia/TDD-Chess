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

  makeMove(move: IMove, game: IGame): boolean {
    return game.makeMove(move)
  }
}
