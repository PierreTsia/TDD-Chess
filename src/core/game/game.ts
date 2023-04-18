import { Board } from '~/core/board/board'
import { MoveHistory } from '~/core/moves/move-history'
import { Queen } from '~/core/pieces/queen'
import { Player } from '~/core/player/player'
import type {
  Color,
  GameStatus,
  IBoard,
  IGame,
  IMove,
  IMoveHistory,
  IPiece,
  IPlayer,
  Position,
} from '~/core/types'

export class Game implements IGame {
  board: IBoard
  currentPlayer: IPlayer
  players: [IPlayer, IPlayer]
  status: GameStatus
  moveHistory: IMoveHistory

  constructor(playersNames?: [string, string]) {
    const whitePlayer = new Player(
      'white',
      true,
      playersNames?.[0] || 'player 1'
    )
    const blackPlayer = new Player(
      'black',
      true,
      playersNames?.[1] || 'player 2'
    )
    this.board = new Board()
    this.currentPlayer = whitePlayer
    this.players = [whitePlayer, blackPlayer]
    this.status = 'not_started'
    this.moveHistory = new MoveHistory()
  }

  get capturedPieces(): Array<IPiece> {
    return this.moveHistory.getCapturedPieces()
  }

  get gameWinner(): IPlayer | null {
    if (this.status !== 'checkmate') {
      return null
    }

    return this.currentPlayer.color === 'white'
      ? this.players[1]
      : this.players[0]
  }

  initializeGame(): void {
    this.board.resetBoard()
    this.board.initializeBoard()
    this.board.setStartingPosition()
    this.moveHistory = new MoveHistory()
    this.status = 'not_started'

    this.startGame()
  }

  startGame() {
    this.currentPlayer = this.players[0]
    this.status = 'ongoing'
  }

  private isCurrentPlayerTurn(pieceColor: Color): boolean {
    return pieceColor === this.currentPlayer.color
  }

  undoMove(): boolean {
    const lastMove = this.moveHistory.moves[this.moveHistory.moves.length - 1]
    if (!lastMove) {
      return false
    }
    const {
      piece,
      capturedPiece,
      startPosition,
      endPosition,
      specialMoveType,
    } = lastMove
    piece.position = startPosition
    this.board.setPieceAt(startPosition, piece)
    this.board.setPieceAt(endPosition, null)

    let capturedPiecePosition = endPosition
    if (specialMoveType === 'en_passant') {
      const direction = capturedPiece?.color === 'white' ? -1 : 1
      capturedPiecePosition = {
        x: endPosition.x,
        y: endPosition.y + direction,
      } as Position
    }
    this.board.setPieceAt(capturedPiecePosition, capturedPiece)

    this.switchPlayer()
    this.updateStatus()
    this.moveHistory.undoMove()
    return true
  }

  redoMove(): boolean {
    const lastMove =
      this.moveHistory.cancelledMoves[
        this.moveHistory.cancelledMoves.length - 1
      ]
    if (!lastMove) {
      return false
    }

    const { piece, startPosition, endPosition, specialMoveType } = lastMove
    piece.position = endPosition
    this.board.setPieceAt(endPosition, piece)
    this.board.setPieceAt(startPosition, null)
    let capturedPiecePosition = endPosition
    if (specialMoveType === 'en_passant') {
      const direction = piece.color === 'white' ? 1 : -1
      capturedPiecePosition = {
        x: endPosition.x,
        y: endPosition.y + direction,
      } as Position
      this.board.setPieceAt(capturedPiecePosition, null)
    } else if (specialMoveType === 'promotion') {
      this.board.setPieceAt(endPosition, new Queen(piece.color, endPosition))
    }

    this.switchPlayer()
    this.updateStatus()
    this.moveHistory.redoMove()
    return true
  }

  makeMove(move: IMove): boolean {
    const lastMove = this.moveHistory.moves[this.moveHistory.moves.length - 1]
    if (
      !this.isCurrentPlayerTurn(move.piece.color) ||
      this.isGameOver() ||
      !move.isValid(this.board, lastMove)
    ) {
      return false
    }

    this.board.applyMove(move, lastMove)
    this.moveHistory.addMove(move)

    this.switchPlayer()
    this.updateStatus()

    return true
  }

  private updateStatus(): void {
    const isCheck = this.board.isKingInCheck(this.currentPlayer.color)
    if (this.board.isMate(this.currentPlayer.color)) {
      this.status = isCheck ? 'checkmate' : 'stalemate'
    } else {
      this.status = isCheck ? 'check' : 'ongoing'
    }
  }

  isGameOver(): boolean {
    return ['checkmate', 'stalemate'].includes(this.status)
  }

  switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]
  }
}
