import type { IGame, IMove, IMoveHistory } from '~/core/types'

export class MoveHistory implements IMoveHistory {
  moves: Array<IMove>

  constructor() {
    this.moves = []
  }

  addMove(move: IMove): void {
    this.moves.push(move)
  }

  undoMove(game: IGame): boolean {
    return false
  }

  redoMove(game: IGame): boolean {
    return false
  }

  getMoves(): Array<IMove> {
    return this.moves
  }
}
