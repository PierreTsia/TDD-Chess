import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { BOARD_SIZE } from '~/core/constants'
import { Move } from '~/core/moves/move'
import type {
  Color,
  IBoard,
  IMove,
  IPiece,
  Modifier,
  PieceType,
  Position,
} from '~/core/types'

export class Piece implements IPiece {
  color: Color
  type!: PieceType

  position: Position

  hasMoved = false

  directionOffsets: Array<{ x: Modifier; y: Modifier }> = []

  protected constructor(color: Color, position: Position) {
    this.color = color
    this.position = position
  }

  getOppositeColor(color: Color) {
    return color === 'white' ? 'black' : 'white'
  }

  getMoveSquares(board: IBoard, includeAlly = false): Array<Position> {
    const moves: Array<Position> = []

    for (const direction of this.directionOffsets) {
      let currentX = this.position.x + direction.x
      let currentY = this.position.y + direction.y

      while (
        currentX >= 0 &&
        currentX < BOARD_SIZE &&
        currentY >= 0 &&
        currentY < BOARD_SIZE
      ) {
        const currentPosition = { x: currentX, y: currentY }
        const pieceAtPosition = board.getPieceAt(currentPosition as Position)

        if (!pieceAtPosition) {
          moves.push(currentPosition as Position)
          currentX += direction.x
          currentY += direction.y
        } else if (pieceAtPosition.color !== this.color) {
          moves.push(currentPosition as Position)
          break
        } else if (includeAlly) {
          moves.push(currentPosition as Position)
          break
        } else {
          break
        }
      }
    }

    return moves
  }

  getPotentialReach(board: IBoard): Array<Position> {
    return this.getMoveSquares(board, true)
  }

  isAlignedWithKing(kingPosition: Position, position: Position): boolean {
    const xDiff = Math.abs(kingPosition.x - position.x)
    const yDiff = Math.abs(kingPosition.y - position.y)
    return xDiff === 0 || yDiff === 0 || xDiff === yDiff
  }

  noPieceBetweenKingAndPosition(
    kingPosition: Position,
    position: Position,
    board: IBoard
  ): boolean {
    const xDirection =
      position.x > kingPosition.x ? 1 : position.x < kingPosition.x ? -1 : 0
    const yDirection =
      position.y > kingPosition.y ? 1 : position.y < kingPosition.y ? -1 : 0

    let currentX = kingPosition.x + xDirection
    let currentY = kingPosition.y + yDirection

    while (currentX !== position.x || currentY !== position.y) {
      if (board.getPieceAt({ x: currentX, y: currentY } as Position) !== null) {
        return false
      }

      currentX += xDirection
      currentY += yDirection
    }

    return true
  }

  isInDirectLineWithKing(board: IBoard): boolean {
    const myKing = board.getAllPieces(this.color).find((p) => p.type === 'king')
    if (!myKing?.position) {
      return false
    }

    return (
      this.isAlignedWithKing(myKing.position, this.position) &&
      this.noPieceBetweenKingAndPosition(myKing.position, this.position, board)
    )
  }

  isPinned(board: IBoard): boolean {
    const boardCopy = cloneDeep(board)
    boardCopy.setPieceAt(this.position, null)
    return boardCopy.isKingInCheck(this.color)
  }

  getPossibleMoves(board: IBoard): Array<IMove> {
    const isKing = board.getPieceAt(this.position)?.type === 'king'
    if (!isKing && this.isPinned(board) && this.isInDirectLineWithKing(board)) {
      return []
    }
    return this.getMoveSquares(board).map(
      (position) => new Move(this, this.position, position)
    )
  }

  canMoveTo(position: Position, board: IBoard): boolean {
    const possibleMoves = this.getPossibleMoves(board)
    return possibleMoves.some((move) => isEqual(move.endPosition, position))
  }
}
