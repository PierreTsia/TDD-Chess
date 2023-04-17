import { Move } from '~/core/moves/move'

import type { IMove, IPiece, Position } from '~/core/types'
import { useChessGame } from '~/composables/chessGame'

const { board, currentPlayer, game } = useChessGame()

const isBlackPov = ref(true)
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
  const squareColor = (y: number, x: number) => {
    if (
      selectedSquare.value &&
      selectedSquare.value.y === y &&
      selectedSquare.value.x === x
    ) {
      return 'bg-blue-400'
    }
    const isEven = (num: number) => num % 2 === 0
    const isEvenRow = isEven(y)
    const isEvenCol = isEven(x)

    return isEvenRow === isEvenCol ? 'bg-gray-200' : 'bg-gray-400'
  }

  return {
    isBlackPov,
    onGoingMove,
    switchPov,
    squareColor,
    handleSquareClick,
    selectedSquare,
    selectedPiece,
  }
}
