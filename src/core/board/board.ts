import cloneDeep from 'lodash/cloneDeep'
import { COORDS, INIT_PIECES_COORDS } from '~/core/constants'
import { Move } from '~/core/moves/move'
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

  resetBoard() {
    this.squares = new Array(8).fill(null).map(() => new Array(8).fill(null))
  }

  private placePawns() {
    for (let i = 0; i < 8; i++) {
      const whitePawnPos = { x: i, y: 6 } as Position
      const blackPawnPos = { x: i, y: 1 } as Position
      this.setPieceAt(whitePawnPos, new Pawn('white', whitePawnPos))
      this.setPieceAt(blackPawnPos, new Pawn('black', blackPawnPos))
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
    return i <= 1 ? 'black' : 'white'
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
        new Queen(i === 0 ? 'black' : 'white', { x, y })
      )
    })
  }

  private placeKings() {
    INIT_PIECES_COORDS.king.forEach(([x, y], i) => {
      this.setPieceAt({ x, y }, new King(i === 0 ? 'black' : 'white', { x, y }))
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

  isAllyPieceAt(position: Position, color: Color): boolean {
    const piece = this.getPieceAt(position)
    return piece !== null && piece.color === color
  }

  applyMove(move: IMove): void {
    // remove piece from source square
    const piece: IPiece | null = this.getPieceAt(move.startPosition)
    if (!piece || piece.type !== move.piece?.type) {
      throw new Error(
        `Invalid move ${JSON.stringify(move)} with piece ${JSON.stringify(
          piece
        )}`
      )
    } else {
      this.setPieceAt(move.startPosition, null)
      this.setPieceAt(move.endPosition, piece)
      if (move.specialMoveType === 'castling') {
        this.applyCastling(move)
      }
      piece.hasMoved = true
    }
  }

  private applyCastling(move: IMove) {
    const rook = this.getPieceAt({
      x: move.endPosition.x === 6 ? 7 : 0,
      y: move.endPosition.y,
    } as Position)!

    const newRookPosition: Position = {
      x: move.endPosition.x === 6 ? 5 : 3,
      y: move.endPosition.y,
    }
    this.setPieceAt(rook?.position, null)
    this.setPieceAt(newRookPosition, rook)
  }

  private isEqualPosition(position1: Position, position2: Position): boolean {
    return position1.x === position2.x && position1.y === position2.y
  }

  isPositionUnderAttack(position: Position, attackingColor: Color): boolean {
    const enemyPieces = this.getAllPieces(attackingColor)
    const attackedSquares = enemyPieces.flatMap((piece) =>
      piece.getPotentialReach(this)
    )
    return attackedSquares.some((square) =>
      this.isEqualPosition(square, position)
    )
  }

  isKingInCheck(kingColor: Color): boolean {
    const king = this.getAllPieces(kingColor).find((p) => p.type === 'king')
    return (
      !!king &&
      this.isPositionUnderAttack(king.position, king.getOppositeColor())
    )
  }

  isCheckMate(kingColor: Color): boolean {
    return this.kingIsTrapped(kingColor) && this.noPieceCanDefend(kingColor)
  }

  private noPieceCanDefend(kingColor: Color): boolean {
    const pieces: IPiece[] = this.getAllPieces(kingColor)
      .filter((p) => p.type !== 'king')
      .flat()
    const piecesCanDefend = pieces.some((piece: IPiece) => {
      const moves = piece.getMoveSquares(this)
      return moves.some((position: Position) => {
        const boardCopy = cloneDeep(this)
        const possibleMove = new Move(piece, piece.position, position)
        boardCopy.applyMove(possibleMove)
        return !boardCopy.isKingInCheck(kingColor)
      })
    })
    return !piecesCanDefend
  }

  private kingIsTrapped(kingColor: Color): boolean {
    const king = this.getAllPieces(kingColor).find((p) => p.type === 'king')!

    if (!king) {
      return false
    }
    const kingMoves = king.getMoveSquares(this)
    const kingCanMove = kingMoves.some((position: Position) => {
      const boardCopy = cloneDeep(this)
      const possibleMove = new Move(king, king.position, position)
      boardCopy.applyMove(possibleMove)
      return !boardCopy.isKingInCheck(kingColor)
    })
    return !kingCanMove
  }

  getAllPieces(color: Color): Array<IPiece> {
    return this.squares
      .flat()
      .filter((piece) => piece?.color === color) as Array<IPiece>
  }
}
