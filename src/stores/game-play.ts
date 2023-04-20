import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ComputedRef } from 'vue'
import { PIECES_WEIGHT } from '~/core/constants'
import { Game } from '~/core/game/game'
import { Player } from '~/core/player/player'
import type { Color, GameStatus, IGame, IPlayer, PieceType } from '~/core/types'
import type { MultiplayerGame, MultiplayerGameState } from '~/services/api'
import { SupabaseService } from '~/services/api'
import { deserializeBoard } from '~/services/serialization'

type CapturedMaterial = Record<Color, Record<PieceType, number>>
export const useGamePlayStore = defineStore('gamePlay', () => {
  const api = new SupabaseService()
  const players = ref<[IPlayer, IPlayer]>([
    new Player('white', true, 'Deep Blue', '2'),
    new Player('black', true, 'Gary Kasparov', '3'),
  ])
  const gameState = ref<MultiplayerGameState | null>(null)
  const gameEngine = ref<IGame>(new Game(players.value))
  const board = computed(() => gameEngine.value.board)

  const isBlackPov = ref(false)
  const currentPlayer = computed(() => gameEngine.value.currentPlayer)
  const status = computed(() => gameEngine.value.status)
  const winner = computed(() => gameEngine.value.gameWinner)
  const lastMove = computed(
    () => gameEngine.value?.moveHistory?.getLastMove() ?? null
  )
  const lastCancelledMove = computed(() =>
    gameEngine.value.moveHistory.getLastCancelledMove()
  )
  const initGameEngine = async (game: MultiplayerGame) => {
    const existingGameState = await api.getGameState(game.id)
    players.value = [
      new Player(
        'white',
        true,
        game.white_player.username,
        game.white_player_id!
      ),
      new Player(
        'black',
        true,
        game.black_player.username,
        game.black_player_id!
      ),
    ]

    gameEngine.value = new Game(players.value, api, game.id)

    if (existingGameState) {
      // @ts-expect-error will see later
      gameState.value = existingGameState
      gameEngine.value.board = deserializeBoard(gameState.value.board)
      gameEngine.value.status = game.status as GameStatus
    } else {
      gameEngine.value.initializeGame()
      const board = JSON.stringify(gameEngine.value.board)
      await api.createGameState(game.id, board)
    }
  }

  const startOnlineGame = async () => {
    if (!players.value[0] || !players.value[1]) {
      return
    }
    gameEngine.value.startGame()
  }
  const initOnlineGame = async (gameId: string) => {
    const game = await api.getGame(gameId)
    if (!game) {
      return
    }

    await initGameEngine(game)
  }

  const switchPoV = () => {
    isBlackPov.value = !isBlackPov.value
  }

  const capturedMaterial: ComputedRef<CapturedMaterial> = computed(() =>
    (gameEngine.value?.capturedPieces ?? []).reduce(
      (acc, piece) => {
        if (!acc[piece.color][piece.type]) {
          acc[piece.color][piece.type] = 1
        } else {
          acc[piece.color][piece.type]++
        }
        return acc
      },
      {
        white: {},
        black: {},
      } as CapturedMaterial
    )
  )

  const materialScore = computed(() => {
    const colors: [Color, Color] = ['white', 'black']
    const [white, black] = colors.flatMap((color: Color) => {
      return Object.entries(capturedMaterial.value[color]).reduce(
        (acc, [pieceType, count]) =>
          acc + PIECES_WEIGHT[pieceType as PieceType] * count,
        0
      )
    })

    return {
      white,
      black,
    }
  })

  const start = () => {
    gameEngine.value.initializeGame()
  }

  const undo = () => gameEngine.value.undoMove()
  const redo = () => gameEngine.value.redoMove()

  return {
    gameEngine,
    board,
    currentPlayer,
    status,
    players,
    winner,
    lastMove,
    lastCancelledMove,
    initOnlineGame,
    start,
    undo,
    redo,
    switchPoV,
    materialScore,
    capturedMaterial,
    isBlackPov,
    initGameEngine,
    startOnlineGame,
    gameState,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
