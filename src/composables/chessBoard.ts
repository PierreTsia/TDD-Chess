import { storeToRefs } from 'pinia'
import { Move } from '~/core/moves/move'
import { useGameEventsStore } from '~/stores/game-events'

import { useGamePlayStore } from '~/stores/game-play'
import type { IMove, IPiece, Position } from '~/core/types'

export const useChessBoard = () => {
  const gamePlayStore = useGamePlayStore()
  const gameEventsStore = useGameEventsStore()
  const { isMultiPlayer } = storeToRefs(gameEventsStore)

  const {
    me,
    isBlackPov,
    board,
    currentPlayer,
    gameEngine: game,
  } = storeToRefs(gamePlayStore)

  const onGoingMove = ref<{ from: Position | null }>({
    from: null,
  })

  const selectedSquare = computed(() => {
    if (onGoingMove.value.from) {
      return onGoingMove.value.from
    }
    return null
  })

  const selectedPiece = computed(() => {
    if (selectedSquare.value) {
      const { x, y } = selectedSquare.value
      return board.value.squares[y][x]
    }
    return null
  })

  const isSelected = (x: number, y: number) =>
    selectedSquare.value &&
    selectedSquare.value.x === x &&
    selectedSquare.value.y === y

  const freeSquareClick = ({ x, y }: Position) => {
    if (!onGoingMove.value.from) {
      const piece: IPiece | null = board.value.squares[y][x]
      if (!piece || piece?.color !== currentPlayer.value.color) {
        return
      }
      onGoingMove.value.from = { x, y }
    } else {
      if (!selectedPiece.value) {
        return
      }
      const move: IMove = new Move(
        selectedPiece.value!,
        onGoingMove.value.from!,
        { x, y }
      )

      currentPlayer.value.makeMove(move, game.value)

      onGoingMove.value = { from: null }
    }
  }

  const multiplayerSquareClick = ({ x, y }: Position) => {
    if (!onGoingMove.value.from) {
      const piece: IPiece | null = board.value.squares[y][x]
      if (
        !piece ||
        piece?.color !== currentPlayer.value.color ||
        me.value?.id !== currentPlayer.value.id
      ) {
        return
      }

      onGoingMove.value.from = { x, y }
    } else {
      if (!selectedPiece.value) {
        return
      }
      const move: IMove = new Move(
        selectedPiece.value!,
        onGoingMove.value.from!,
        { x, y }
      )

      if (me.value) {
        me.value.makeMove(move, game.value)
      }

      onGoingMove.value = { from: null }
    }
  }
  const handleSquareClick = ({ x, y }: Position) => {
    if (isMultiPlayer.value) {
      return multiplayerSquareClick({ x, y })
    }
    return freeSquareClick({ x, y })
  }

  return {
    isBlackPov,
    onGoingMove,
    isSelected,
    handleSquareClick,
    selectedSquare,
    selectedPiece,
  }
}
