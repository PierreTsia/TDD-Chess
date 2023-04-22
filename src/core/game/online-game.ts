import { Game } from '~/core/game/game'
import type { IMove, IOnlineGame, IPlayer } from '~/core/types'
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
    this.apiService
      .persistMove(
        this.gameId!,
        {
          board: JSON.stringify(this.board),
          current_player_id: this.players[0].id,
        },
        this.status,
        null
      )
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('game started')
      })
  }

  makeMove(move: IMove): boolean {
    if (super.makeMove(move)) {
      const nextPlayer =
        move.piece.color === 'white' ? this.players[1] : this.players[0]
      this.apiService
        .persistMove(
          this.gameId!,
          {
            board: JSON.stringify(this.board),
            current_player_id: nextPlayer.id,
            captured_pieces: JSON.stringify(this.capturedPieces),
            move_history: JSON.stringify(this.moveHistory),
          },
          this.status,
          this.gameWinner?.id ?? null
        )
        .then((r) => {
          // eslint-disable-next-line no-console
          console.log('move persisted', r)
        })
      return true
    }
    return false
  }
}
