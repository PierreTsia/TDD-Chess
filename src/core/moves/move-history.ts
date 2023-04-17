import type { IMove, IMoveHistory } from '~/core/types'

export class MoveHistory implements IMoveHistory {
  moves: Array<IMove>
  cancelledMoves: Array<IMove>

  constructor() {
    this.moves = []
    this.cancelledMoves = []
  }

  addMove(move: IMove): void {
    this.moves.push(move)
  }

  undoMove(): boolean {
    const lastMove = this.moves.pop()
    if (!lastMove) {
      return false
    }
    this.cancelledMoves.unshift(lastMove)
    return true
  }

  redoMove(): boolean {
    const lastMove = this.cancelledMoves.shift()
    if (!lastMove) {
      return false
    }
    this.moves.push(lastMove)
    return true
  }

  getMoves(): Array<IMove> {
    return this.moves
  }
}
