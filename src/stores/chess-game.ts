import { defineStore } from 'pinia'
import { Game } from '~/core/game/game'
import { Player } from '~/core/player/player'
import type { IGame, IMove, IPlayer } from '~/core/types'

export const useChessGameStore = defineStore('chessGame', () => {
  const playgroundPlayers = ref<[IPlayer, IPlayer]>([
    new Player('white', true, 'Deep Blue', '2'),
    new Player('black', true, 'Gary Kasparov', '3'),
  ])

  const gameEngine = ref<IGame>(new Game(playgroundPlayers.value))
  const board = computed(() => gameEngine.value.board)
  const moveHistory = computed<Array<IMove>>(
    () => gameEngine.value.moveHistory.moves
  )
  const isBlackPov = ref(false)
  const currentPlayer = computed(() => gameEngine.value.currentPlayer)
  const status = computed(() => gameEngine.value.status)
  const winner = computed(() => gameEngine.value.gameWinner)
  const lastMove = computed(() => gameEngine.value.moveHistory.getLastMove())
  const lastCancelledMove = computed(() =>
    gameEngine.value.moveHistory.getLastCancelledMove()
  )

  const isGameOver = computed(() =>
    ['checkmate', 'draw', 'resigned'].includes(status.value)
  )

  const initSoloGame = () => {
    gameEngine.value = new Game(playgroundPlayers.value)
  }

  const playSound = (move: IMove): void => {
    const moveAudioFile =
      move.specialMoveType === 'castling'
        ? 'castle'
        : move.capturedPiece
        ? 'capture'
        : 'move-self'

    const audio = new Audio(`/sounds/${moveAudioFile}.mp3`)

    audio.play().then(() => {
      // eslint-disable-next-line no-console
      console.log('audio played')
    })
  }

  const switchPoV = () => {
    isBlackPov.value = !isBlackPov.value
  }
  const start = () => {
    gameEngine.value.initializeGame()
  }

  const undo = () => gameEngine.value.undoMove()
  const redo = () => gameEngine.value.redoMove()

  return {
    gameEngine,
    board,
    moveHistory,
    isBlackPov,
    currentPlayer,
    status,
    winner,
    lastMove,
    lastCancelledMove,
    isGameOver,
    initSoloGame,
    playSound,
    start,
    undo,
    redo,
    switchPoV,
  }
})
