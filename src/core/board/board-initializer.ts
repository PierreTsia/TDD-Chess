import { INIT_PIECES_COORDS } from '~/core/constants'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type { IBoard, IPiece, Position } from '~/core/types'

export class BoardInitializer {
  generateEmptySquares(): Array<Array<IPiece | null>> {
    return new Array(8).fill(null).map(() => new Array(8).fill(null))
  }

  placePawns(board: IBoard) {
    for (let i = 0; i < 8; i++) {
      const whitePawnPos = { x: i, y: 6 } as Position
      const blackPawnPos = { x: i, y: 1 } as Position
      board.setPieceAt(whitePawnPos, new Pawn('white', whitePawnPos))
      board.setPieceAt(blackPawnPos, new Pawn('black', blackPawnPos))
    }
  }

  placeRooks(board: IBoard) {
    INIT_PIECES_COORDS.rook.forEach(([x, y], i) => {
      board.setPieceAt({ x, y }, new Rook(this.getPieceColor(i), { x, y }))
    })
  }

  placeKnights(board: IBoard) {
    INIT_PIECES_COORDS.knight.forEach(([x, y], i) => {
      board.setPieceAt({ x, y }, new Knight(this.getPieceColor(i), { x, y }))
    })
  }

  private getPieceColor(i: number) {
    return i <= 1 ? 'black' : 'white'
  }

  placeBishops(board: IBoard) {
    INIT_PIECES_COORDS.bishop.forEach(([x, y], i) => {
      board.setPieceAt({ x, y }, new Bishop(this.getPieceColor(i), { x, y }))
    })
  }

  placeQueens(board: IBoard) {
    INIT_PIECES_COORDS.queen.forEach(([x, y], i) => {
      board.setPieceAt(
        { x, y },
        new Queen(i === 0 ? 'black' : 'white', { x, y })
      )
    })
  }

  placeKings(board: IBoard) {
    INIT_PIECES_COORDS.king.forEach(([x, y], i) => {
      board.setPieceAt(
        { x, y },
        new King(i === 0 ? 'black' : 'white', { x, y })
      )
    })
  }
}
