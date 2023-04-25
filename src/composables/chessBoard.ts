import { storeToRefs } from 'pinia'
import { Move } from '~/core/moves/move'
import { useChessGameStore } from '~/stores/chess-game'

import type { IMove, IPiece, Position } from '~/core/types'

export const useChessBoard = () => {

  const chessGameStore = useChessGameStore()


  const {isBlackPov, board, currentPlayer, gameEngine } =
    storeToRefs(chessGameStore)

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

      if (currentPlayer.value.makeMove(move, gameEngine.value)) {
        chessGameStore.playSound(gameEngine.value.moveHistory.getLastMove()!)
      }

      onGoingMove.value = { from: null }
    }
  }

  /* const multiplayerSquareClick = ({ x, y }: Position) => {
    if (!me.value) {
      return
    }
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

      me.value.makeMove(move, gameEngine.value)
      onGoingMove.value = { from: null }
    }
  } */
  const handleSquareClick = ({ x, y }: Position) => {
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
