import { COORDS, INIT_PIECES_COORDS } from '~/core/constants'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type { Color, IBoard, IMove, IPiece, Position } from '~/core/types'

export class Board implements IBoard {
  squares: Array<Array<IPiece | null>>

  constructor() {
    this.squares = new Array(8).fill(null).map(() => new Array(8).fill(null))
  }

  initializeBoard(): void {
    this.setStartingPosition()
  }

  private placePawns() {
    for (let i = 0; i < 8; i++) {
      this.setPieceAt({ x: i, y: 1 }, new Pawn('white', { x: i, y: 1 }))
      this.setPieceAt({ x: i, y: 6 }, new Pawn('black', { x: i, y: 6 }))
    }
  }

  private placeRooks() {
    INIT_PIECES_COORDS.rook.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Rook(this.getPieceColor(i), { x, y }))
    })
  }

  private placeKnights() {
    INIT_PIECES_COORDS.knight.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Knight(this.getPieceColor(i), { x, y }))
    })
  }

  private getPieceColor(i: number) {
    return i <= 1 ? 'white' : 'black'
  }

  private placeBishops() {
    INIT_PIECES_COORDS.bishop.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Bishop(this.getPieceColor(i), { x, y }))
    })
  }

  private placeQueens() {
    INIT_PIECES_COORDS.queen.forEach(([x, y], i) => {
      this.setPieceAt(
        { x, y },
        new Queen(i === 0 ? 'white' : 'black', { x, y })
      )
    })
  }

  private placeKings() {
    INIT_PIECES_COORDS.king.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new King(i === 0 ? 'white' : 'black', { x, y }))
    })
  }

  setStartingPosition(): void {
    this.placePawns()
    this.placeRooks()
    this.placeBishops()
    this.placeKnights()
    this.placeQueens()
    this.placeKings()
  }

  isOutOfBounds(position: Position): boolean {
    const { x, y } = position
    return !COORDS.includes(x) || !COORDS.includes(y)
  }

  getPieceAt(position: Position): IPiece | null {
    if (this.isOutOfBounds(position)) {
      return null
    }
    const { x, y } = position
    return this.squares[y][x]
  }

  setPieceAt(position: Position, piece: IPiece | null): void {
    const { x, y } = position
    this.squares[y][x] = piece
    if (piece) {
      piece.position = position
    }
  }

  isValidMove(move: IMove): boolean {
    return false
  }

  isEmptySquare(position: Position): boolean {
    return this.getPieceAt(position) === null
  }

  isEnemyPieceAt(position: Position, color: Color): boolean {
    const piece = this.getPieceAt(position)
    return piece !== null && piece.color !== color
  }

  applyMove(move: IMove): void {
    // remove piece from source square
    const piece: IPiece | null = this.getPieceAt(move.startPosition)
    if (!piece || piece.type !== move.piece.type) {
      throw new Error('Invalid move')
    } else {
      this.setPieceAt(move.startPosition, null)
      this.setPieceAt(move.endPosition, piece)
      piece.hasMoved = true
    }

    // place piece on destination square
  }

  isPositionUnderAttack(position: Position, attackingColor: Color): boolean {
    return false
  }

  getAllPieces(color: Color): Array<IPiece> {
    return []
  }
}
// Later, you will implement this method to create pieces and place them
