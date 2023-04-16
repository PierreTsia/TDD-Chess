import { Game } from '~/core/game/game'

const game = ref(new Game())
export const useChessGame = () => {
  const board = computed(() => game.value.board)
  const currentPlayer = computed(() => game.value.currentPlayer)
  const status = computed(() => game.value.status)

  const start = () => {
    game.value.initializeGame()
  }

  return {
    board,
    currentPlayer,
    status,
    start,
  }
}
