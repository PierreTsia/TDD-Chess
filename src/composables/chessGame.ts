import { Game } from '~/core/game/game'

const game = ref(new Game(['Gary Kasparov', 'Deep Blue']))
export const useChessGame = () => {
  const board = computed(() => game.value.board)
  const currentPlayer = computed(() => game.value.currentPlayer)
  const status = computed(() => game.value.status)
  const players = computed(() => game.value.players)

  const start = () => {
    game.value.initializeGame()
  }

  return {
    players,
    game,
    board,
    currentPlayer,
    status,
    start,
  }
}
