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
  IPlayer,
} from '~/core/types'

export class Game implements IGame {
  board: IBoard
  currentPlayer: IPlayer
  players: [IPlayer, IPlayer]
  status: GameStatus
  moveHistory: IMoveHistory

  constructor() {
    const whitePlayer = new Player('white')
    const blackPlayer = new Player('black')
    this.board = new Board()
    this.currentPlayer = whitePlayer
    this.players = [whitePlayer, blackPlayer]
    this.status = 'not_started'
    this.moveHistory = new MoveHistory()
  }

  initializeGame(): void {
    this.board.resetBoard()
    this.board.initializeBoard()
    this.board.setStartingPosition()

    this.startGame()
  }

  startGame() {
    this.currentPlayer = this.players[0]
    this.status = 'ongoing'
  }

  private isCurrentPlayerTurn(pieceColor: Color): boolean {
    return pieceColor === this.currentPlayer.color
  }

  makeMove(move: IMove): boolean {
    if (
      !this.isCurrentPlayerTurn(move.piece.color) ||
      this.isGameOver() ||
      !move.isValid(this.board)
    ) {
      return false
    }

    this.board.applyMove(move)
    this.moveHistory.addMove(move)

    this.switchPlayer()

    if (this.board.isCheckMate(this.currentPlayer.color)) {
      this.status = 'checkmate'
    } else if (this.board.isKingInCheck(this.currentPlayer.color)) {
      this.status = 'check'
    } else {
      this.status = 'ongoing'
    }

    return true
  }

  isGameOver(): boolean {
    return this.status === 'checkmate'
  }

  getWinner(): IPlayer | null {
    return null
  }

  getValidMovesForCurrentPlayer(): Array<IMove> {
    return []
  }

  switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]
  }
}
