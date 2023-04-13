<script lang="ts" setup>
import { useChessPieces } from '~/composables/chessPieces'

import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import type { IMove, IPiece, Position } from '~/core/types'

const { pieces } = useChessPieces()

const game = ref<Game>(new Game())

const board = computed(() => game.value.board)

const currentPlayer = computed(() => game.value.currentPlayer)

const onGoingMove = ref<{ from: Position | null; to: Position | null }>({
  from: null,
  to: null,
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

    onGoingMove.value = { from: null, to: null }
  }
}



const start = () => {
  game.value.initializeGame()
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
</script>

<template>
  <div class="mx-auto max-w-[480px]">
    <div
      v-for="(row, y) in board.squares"
      :key="`row-${y}`"
      class="mx-auto grid grid-cols-8 h-[60px]">
      <span
        v-for="(col, x) in row"
        :key="`col-${x}`"
        :class="squareColor(y, x)"
        class="w-[60px] h-[60px] flex justify-center items-center"
        @click="handleSquareClick({ y, x })">
        <span
          v-if="board.squares[y][x]"
          class="w-full h-60px flex justify-center items-center">
          <component
            :is="pieces[board.squares[y][x].type][board.squares[y][x].color]" />
        </span>
      </span>
    </div>
  </div>
  <o-button my-6 type="secondary" @click="start"> Start </o-button>
</template>
