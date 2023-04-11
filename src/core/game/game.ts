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
    this.status = 'ongoing'
    this.moveHistory = new MoveHistory()
  }

  initializeGame(): void {
    this.board.initializeBoard()
    this.board.setStartingPosition()
  }

  // Implement other methods as required by the IGame interface
  startGame() {}

  private isCurrentPlayerTurn(pieceColor: Color): boolean {
    return pieceColor === this.currentPlayer.color
  }

  makeMove(move: IMove): boolean {
    if (!this.isCurrentPlayerTurn(move.piece.color)) {
      return false
    }
    const isValidMove = move.isValid(this.board)
    if (isValidMove) {
      this.board.applyMove(move)
      this.moveHistory.addMove(move)
      this.switchPlayer()
    }

    return isValidMove
  }

  isGameOver(): boolean {
    return false
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
