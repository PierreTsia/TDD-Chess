import { Board } from '~/core/board/board'
import { MoveHistory } from '~/core/moves/move-history'
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
} from '~/core/types'

export class Game implements IGame {
  board: IBoard
  currentPlayer: IPlayer
  players: [IPlayer, IPlayer]
  status: GameStatus
  moveHistory: IMoveHistory

  gameWinner: IPlayer | null = null

  constructor(players?: [IPlayer, IPlayer]) {
    const whitePlayer = new Player(
      'white',
      true,
      players?.[0]?.name || 'player 1',
      players?.[0]?.id
    )
    const blackPlayer = new Player(
      'black',
      true,
      players?.[1]?.name || 'player 2',
      players?.[1]?.id
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

  setGameWinner(): void {
    if (this.status !== 'checkmate') {
      this.gameWinner = null
    } else {
      const hasWhiteWon = this.board.isMate('black')
      this.gameWinner = hasWhiteWon ? this.players[0] : this.players[1]
    }
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
    const lastMove = this.moveHistory.getLastMove()
    if (!lastMove) {
      return false
    }
    this.board.undoMove(lastMove)
    this.switchPlayer()
    this.updateStatus()
    this.moveHistory.undoMove()
    return true
  }

  redoMove(): boolean {
    const lastMove = this.moveHistory.getLastCancelledMove()
    if (!lastMove) {
      return false
    }
    this.board.redoMove(lastMove)
    this.switchPlayer()
    this.updateStatus()
    this.moveHistory.redoMove()
    return true
  }

  makeMove(move: IMove): boolean {
    const lastMove = this.moveHistory.getLastMove()
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

  updateStatus(): void {
    const isCheck = this.board.isKingInCheck(this.currentPlayer.color)
    if (this.board.isMate(this.currentPlayer.color)) {
      this.status = isCheck ? 'checkmate' : 'stalemate'
    } else {
      this.status = isCheck ? 'check' : 'ongoing'
    }

    this.setGameWinner()
  }

  isGameOver(): boolean {
    return ['checkmate', 'stalemate'].includes(this.status)
  }

  switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]
  }
}
