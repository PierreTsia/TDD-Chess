import type { IMove, IMoveHistory, IPiece } from '~/core/types'

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

  getCapturedPieces(): IPiece[] {
    return this.moves
      .map((move) => move.capturedPiece)
      .filter((piece) => piece !== null) as IPiece[]
  }

  undoMove(): boolean {
    const lastMove = this.moves.pop()

    if (!lastMove) {
      return false
    }
    this.cancelledMoves.push(lastMove)
    return true
  }

  redoMove(): boolean {
    const lastMove = this.cancelledMoves.pop()

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
