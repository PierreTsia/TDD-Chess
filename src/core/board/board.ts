import cloneDeep from 'lodash/cloneDeep'
import { BoardInitializer } from '~/core/board/board-initializer'
import { COORDS } from '~/core/constants'
import { Move } from '~/core/moves/move'
import { Queen } from '~/core/pieces/queen'

import type { Color, IBoard, IMove, IPiece, Position } from '~/core/types'

export class Board implements IBoard {
  squares: Array<Array<IPiece | null>>
  boardInitializer = new BoardInitializer()

  constructor() {
    this.squares = this.boardInitializer.generateEmptySquares()
  }

  initializeBoard(): void {
    this.setStartingPosition()
  }

  resetBoard() {
    this.squares = this.boardInitializer.generateEmptySquares()
  }

  setStartingPosition(): void {
    this.boardInitializer.placePawns(this)
    this.boardInitializer.placeRooks(this)
    this.boardInitializer.placeKnights(this)
    this.boardInitializer.placeBishops(this)
    this.boardInitializer.placeQueens(this)
    this.boardInitializer.placeKings(this)
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
    const piece: IPiece | null = this.getPieceAt(move.startPosition)
    if (!piece || piece.type !== move.piece?.type) {
      throw new Error('Invalid move')
    } else {
      if (move.specialMoveType === 'castling') {
        this.applyCastling(move)
      } else if (move.specialMoveType === 'promotion') {
        this.applyPromotion(move)
      } else {
        this.setPieceAt(move.endPosition, piece)
      }

      this.setPieceAt(move.startPosition, null)
      piece.hasMoved = true
    }
  }

  private getCastingRook(move: IMove): IPiece {
    return this.getPieceAt({
      x: move.endPosition.x === 6 ? 7 : 0,
      y: move.endPosition.y,
    } as Position)!
  }

  private castlingRookDestination(move: IMove): Position {
    return {
      x: move.endPosition.x === 6 ? 5 : 3,
      y: move.endPosition.y,
    }
  }

  private applyCastling(move: IMove) {
    const rook = this.getCastingRook(move)
    this.setPieceAt(rook.position, null)
    this.setPieceAt(this.castlingRookDestination(move), rook)
    this.setPieceAt(move.endPosition, move.piece)
  }

  private applyPromotion(move: IMove) {
    this.setPieceAt(move.startPosition, null)
    this.setPieceAt(
      move.endPosition,
      new Queen(move.piece?.color, move.endPosition)
    )
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
