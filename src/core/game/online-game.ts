import { Game } from '~/core/game/game'
import type { IMove, IOnlineGame, IPlayer } from '~/core/types'
import type { GameStateUpdate } from '~/modules/types/supabase'
import type { MultiplayerService } from '~/services/api'

export class MultiplayerGameEngine extends Game implements IOnlineGame {
  apiService: MultiplayerService
  gameId: string
  constructor(
    players: [IPlayer, IPlayer],
    apiService: MultiplayerService,
    onlineGameId: string
  ) {
    super(players)
    this.apiService = apiService
    this.gameId = onlineGameId
  }

  startGame() {
    super.startGame()
    this.updateOnlineGame()
  }

  makeMove(move: IMove): boolean {
    if (!super.makeMove(move)) {
      return false
    }

    this.updateOnlineGame()
    return true
  }

  private updateOnlineGame() {
    this.updateStatus()
    this.apiService
      .persistMove(
        this.gameId!,
        this.generateGameStateUpdate(),
        this.status,
        this.gameWinner?.id ?? null
      )
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('game state persisted')
      })
  }

  private generateGameStateUpdate(): GameStateUpdate {
    const lastMove = this.moveHistory.getLastMove()
    const lastColorPlayed = lastMove?.piece.color

    const nextPlayer =
      this.players.find((player) => player.color !== lastColorPlayed) ??
      this.players[0]

    return {
      board: JSON.stringify(this.board),
      current_player_id: nextPlayer.id,
      captured_pieces: JSON.stringify(this.capturedPieces),
      move_history: JSON.stringify(this.moveHistory),
    }
  }
}
