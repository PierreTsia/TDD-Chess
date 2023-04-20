<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useChessPieces } from '~/composables/chessPieces'
import { useChessBoard } from '~/composables/chessBoard'
import { Position } from '~/core/types'
import { useGamePlayStore } from '~/stores/game-play'

const gamePlayStore = useGamePlayStore()

const { board, status, isBlackPov } = storeToRefs(gamePlayStore)
const { chessPiece } = useChessPieces()
const { handleSquareClick, isSelected } = useChessBoard()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndSmaller = breakpoints.smallerOrEqual('md')

const squareSize = computed(() =>
  mdAndSmaller.value ? 'w-[45px] h-[45px]' : 'w-[80px] h-[80px]'
)
const isEven = (num: number) => num % 2 === 0

const squareColor = (y: number, x: number) => {
  if (isSelected(x, y)) {
    return 'bg-blue-400'
  }
  return isEven(y) === isEven(x) ? 'bg-gray-200' : 'bg-gray-400'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      :class="{
        'max-w-[360px]': mdAndSmaller,
        'max-w-[640px]': !mdAndSmaller,
        'transform rotate-180': isBlackPov,
        'transform rotate-0': !isBlackPov,
        'outline outline-double outline-red-500': status === 'checkmate',
        'outline outline-double outline-yellow-500': status === 'check',
        'outline outline-double outline-indigo-500': status === 'stalemate',
      }">
      <div
        v-for="(row, y) in board.squares"
        :key="`row-${y}`"
        :class="mdAndSmaller ? 'h-[45px]' : 'h-[80px]'"
        class="mx-auto grid grid-cols-8">
        <span
          v-for="(_, x) in row"
          :key="`col-${x}`"
          :class="[squareColor(y, x), squareSize]"
          class="flex justify-center items-center chess-square"
          :data-test-id="`square-${y}-${x}`"
          @click="handleSquareClick({ y, x } as Position)">
          <span
            v-if="chessPiece({ x, y } as Position, board)"
            :class="squareSize"
            class="w-full flex justify-center items-center">
            <component
              :is="chessPiece({ x, y } as Position, board) as ReturnType<typeof defineComponent>"
              :class="{
                black: board.squares[y][x]?.color === 'black',
                white: board.squares[y][x]?.color === 'white',
                'transform rotate-180': isBlackPov,
                'scale-75': mdAndSmaller,
                'scale-135': !mdAndSmaller,
              }"
              data-test-id="chess-piece" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
