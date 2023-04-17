import { Move } from '~/core/moves/move'

import type { IMove, IPiece, Position } from '~/core/types'
import { useChessGame } from '~/composables/chessGame'

const { board, currentPlayer, game } = useChessGame()

const isBlackPov = ref(false)
export const useChessBoard = () => {
  const onGoingMove = ref<{ from: Position | null }>({
    from: null,
  })

  const switchPov = () => {
    isBlackPov.value = !isBlackPov.value
  }

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

  const handleSquareClick = ({ x, y }: Position) => {
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

  return {
    isBlackPov,
    onGoingMove,
    switchPov,
    isSelected,
    handleSquareClick,
    selectedSquare,
    selectedPiece,
  }
}
