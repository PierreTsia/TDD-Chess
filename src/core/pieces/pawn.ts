import type { Position } from '@vueuse/core'
import { isEqual } from 'lodash'
import { Move } from '~/core/moves/move'
import type { Color, IBoard, IMove, IPiece, PieceType } from '~/core/types'

export class Pawn implements IPiece {
  color: Color
  type: PieceType

  position: Position

  hasMoved = false

  constructor(color: Color, position: Position) {
    this.color = color
    this.type = 'pawn'
    this.position = position
  }

  get modifier() {
    return this.color === 'white' ? 1 : -1
  }

  private getAttackSquares(board: IBoard): Array<Position> {
    const { x, y } = this.position
    const diagonalLeft = { x: x - 1, y: y + this.modifier }
    const diagonalRight = { x: x + 1, y: y + this.modifier }
    return [diagonalRight, diagonalLeft].filter((p) =>
      board.isEnemyPieceAt(p, this.color)
    )
  }

  private getMoveSquares(board: IBoard): Array<Position> {
    const { x, y } = this.position

    const possibleSquares = [{ x, y: y + this.modifier }]
    if (!this.hasMoved) {
      possibleSquares.push({ x, y: y + this.modifier * 2 })
    }
    return possibleSquares.filter((p) => board.isEmptySquare(p))
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    const moveSquares = this.getMoveSquares(board)
    const attackSquares = this.getAttackSquares(board)

    return [...moveSquares, ...attackSquares].map(
      (position) => new Move(this, this.position, position)
    )
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    const possibleMoves = this.getPossibleMoves(board)
    return possibleMoves.some((move) => isEqual(move.endPosition, position))
  }
}
