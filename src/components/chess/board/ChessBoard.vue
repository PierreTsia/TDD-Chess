<script lang="ts" setup>
import { useChessPieces } from '~/composables/chessPieces'

import { Game } from '~/core/game/game'
import type { XYValue } from '~/core/types'

const { pieces } = useChessPieces()

const game = ref<Game>(new Game())

const board = computed(() => game.value.board)

const selectedSquare = ref<[XYValue, XYValue] | null>([4, 3])

const setSelectedSquare = (y?: XYValue, x?: XYValue) => {
  if (!y || !x) {
    selectedSquare.value = null
    return
  }
  selectedSquare.value = [y, x]
}

const start = () => {
  game.value.initializeGame()
}

const squareColor = (y: number, x: number) => {
  if (
    selectedSquare.value &&
    selectedSquare.value[0] === y &&
    selectedSquare.value[1] === x
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
        class="w-[60px] h-[60px] flex justify-center items-center">
        <span
          v-if="board.squares[y][x]"
          class="w-full h-60px flex justify-center items-center"
          @click="setSelectedSquare(y, x)">
          <component
            :is="pieces[board.squares[y][x].type][board.squares[y][x].color]" />
        </span>
      </span>
    </div>
  </div>
  <o-button my-6 type="secondary" @click="start"> Start </o-button>
</template>
