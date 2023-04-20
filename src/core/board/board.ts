import cloneDeep from 'lodash/cloneDeep'
import { BoardInitializer } from '~/core/board/board-initializer'
import { COORDS } from '~/core/constants'
import { Move } from '~/core/moves/move'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'

import type { Color, IBoard, IMove, IPiece, Position } from '~/core/types'

export class Board implements IBoard {
  squares: Array<Array<IPiece | null>>
  boardInitializer = new BoardInitializer()

  constructor(squares?: Array<Array<IPiece | null>>) {
    this.squares = squares || this.boardInitializer.generateEmptySquares()
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

  applyMove(move: IMove, lastMove?: IMove): void {
    const piece: IPiece | null = this.getPieceAt(move.startPosition)
    const capturedPiece = this.getPieceAt(move.endPosition)

    if (!piece || piece.type !== move.piece?.type) {
      throw new Error('Invalid move')
    } else {
      if (move.specialMoveType === 'castling') {
        this.applyCastling(move)
      } else if (move.specialMoveType === 'promotion') {
        this.applyPromotion(move)
      } else if (move.specialMoveType === 'en_passant') {
        this.applyEnPassant(move, lastMove!)
      } else {
        this.setPieceAt(move.endPosition, piece)
      }

      if (capturedPiece) {
        move.capturedPiece = capturedPiece
      }
      this.setPieceAt(move.startPosition, null)
      piece.hasMoved = true
    }
  }

  undoMove(lastMove: IMove): void {
    const {
      piece,
      capturedPiece,
      startPosition,
      endPosition,
      specialMoveType,
    } = lastMove
    piece.position = startPosition
    this.setPieceAt(startPosition, piece)
    this.setPieceAt(endPosition, null)

    let capturedPiecePosition = endPosition
    if (specialMoveType === 'en_passant') {
      const direction = capturedPiece?.color === 'white' ? -1 : 1
      capturedPiecePosition = {
        x: endPosition.x,
        y: endPosition.y + direction,
      } as Position
    } else if (specialMoveType === 'castling') {
      const rook = this.getPieceAt({
        y: startPosition.y,
        x: endPosition.x === 2 ? 3 : 5,
      } as Position)!
      this.setPieceAt(rook.position, null)
      const newRookPosition: Position = {
        x: rook.position.x === 5 ? 7 : 0,
        y: rook.position.y,
      } as Position
      this.setPieceAt(newRookPosition, new Rook(rook.color, newRookPosition))
    }
    this.setPieceAt(capturedPiecePosition, capturedPiece)
  }

  redoMove(lastMove: IMove): void {
    const { piece, startPosition, endPosition, specialMoveType } = lastMove
    piece.position = endPosition
    this.setPieceAt(endPosition, piece)
    this.setPieceAt(startPosition, null)
    let capturedPiecePosition = endPosition
    if (specialMoveType === 'en_passant') {
      const direction = piece.color === 'white' ? 1 : -1
      capturedPiecePosition = {
        x: endPosition.x,
        y: endPosition.y + direction,
      } as Position
      this.setPieceAt(capturedPiecePosition, null)
    } else if (specialMoveType === 'promotion') {
      this.setPieceAt(endPosition, new Queen(piece.color, endPosition))
    } else if (specialMoveType === 'castling') {
      const rook = this.getCastingRook(lastMove)
      rook.hasMoved = false
      const king = this.getPieceAt(endPosition)!
      king.hasMoved = false
      this.setPieceAt(rook.position, null)
      const newRookPosition = this.castlingRookDestination(lastMove)
      this.setPieceAt(newRookPosition, rook)
    }
  }

  private applyEnPassant(move: IMove, lastMove: IMove) {
    const capturedPawn = this.getPieceAt(lastMove.endPosition)
    const piece = this.getPieceAt(move.startPosition)
    this.setPieceAt(move.endPosition, piece)
    this.setPieceAt(lastMove?.endPosition, null)
    move.capturedPiece = capturedPawn
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

  isMate(kingColor: Color): boolean {
    return this.kingIsTrapped(kingColor) && this.hasNoLegalMoves(kingColor)
  }

  private hasNoLegalMoves(kingColor: Color): boolean {
    const pieces: IPiece[] = this.getAllPieces(kingColor)
      .filter((p) => p.type !== 'king')
      .flat()
    const atLeastOnePieceCanPlay = pieces.some((piece: IPiece) => {
      const moves = piece.getMoveSquares(this)
      return moves.some((position: Position) => {
        const possibleMove = new Move(piece, piece.position, position)
        return !this.wouldBeInCheckAfterMove(possibleMove)
      })
    })
    return !atLeastOnePieceCanPlay
  }

  private kingIsTrapped(kingColor: Color): boolean {
    const king = this.getAllPieces(kingColor).find((p) => p.type === 'king')!
    if (!king) {
      return false
    }
    const kingMoves = king.getMoveSquares(this)
    return kingMoves.every((position: Position) => {
      const possibleMove = new Move(king, king.position, position)
      return this.wouldBeInCheckAfterMove(possibleMove)
    })
  }

  wouldBeInCheckAfterMove(move: IMove): boolean {
    const tempBoard = cloneDeep(this)
    tempBoard.applyMove(move)
    return tempBoard.isKingInCheck(move.piece.color)
  }

  getAllPieces(color: Color): Array<IPiece> {
    return this.squares
      .flat()
      .filter((piece) => piece?.color === color) as Array<IPiece>
  }
}
