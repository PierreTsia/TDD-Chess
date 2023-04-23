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
    if (super.makeMove(move)) {
      this.updateOnlineGame()
      return true
    }
    return false
  }

  private updateOnlineGame() {
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
    return {
      board: JSON.stringify(this.board),
      current_player_id: this.currentPlayer.id,
      captured_pieces: JSON.stringify(this.capturedPieces),
      move_history: JSON.stringify(this.moveHistory),
    }
  }
}