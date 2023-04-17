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

  constructor(playersNames?: [string, string]) {
    const whitePlayer = new Player('white', true, playersNames?.[0] || 'player 1')
    const blackPlayer = new Player('black', true, playersNames?.[1] || 'player 2')
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
    this.moveHistory = new MoveHistory()

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
