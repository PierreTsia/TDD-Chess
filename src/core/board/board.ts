import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type {
  Color,
  IBoard,
  IMove,
  IPiece,
  PieceType,
  Position,
} from '~/core/types'

const InitialPiecesSquares: Record<
  Exclude<PieceType, 'pawn'>,
  Array<[number, number]>
> = {
  rook: [
    [0, 0],
    [7, 0],
    [0, 7],
    [7, 7],
  ],
  bishop: [
    [2, 0],
    [5, 0],
    [2, 7],
    [5, 7],
  ],
  knight: [
    [1, 0],
    [6, 0],
    [1, 7],
    [6, 7],
  ],
  queen: [
    [3, 0],
    [3, 7],
  ],
  king: [
    [4, 0],
    [4, 7],
  ],
}

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
    InitialPiecesSquares.rook.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Rook(this.getPieceColor(i), { x, y }))
    })
  }

  private placeKnights() {
    InitialPiecesSquares.knight.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Knight(this.getPieceColor(i), { x, y }))
    })
  }

  private getPieceColor(i: number) {
    return i <= 1 ? 'white' : 'black'
  }

  private placeBishops() {
    InitialPiecesSquares.bishop.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new Bishop(this.getPieceColor(i), { x, y }))
    })
  }

  private placeQueens() {
    InitialPiecesSquares.queen.forEach(([x, y], i) => {
      this.setPieceAt(
        { x, y },
        new Queen(i === 0 ? 'white' : 'black', { x, y })
      )
    })
  }

  private placeKings() {
    InitialPiecesSquares.king.forEach(([x, y], i) => {
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

  getPieceAt(position: Position): IPiece | null {
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
