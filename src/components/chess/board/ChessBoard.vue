<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useChessPieces } from '~/composables/chessPieces'
import { useChessGame } from '~/composables/chessGame'
import { useChessBoard } from '~/composables/chessBoard'
import { Position } from '~/core/types'

const { chessPiece } = useChessPieces()
const { board, status } = useChessGame()
const { handleSquareClick, squareColor, isBlackPov } = useChessBoard()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndSmaller = breakpoints.smallerOrEqual('md') // lg and smaller
const squareSize = computed(() =>
  mdAndSmaller.value ? 'w-[45px] h-[45px]' : 'w-[60px] h-[60px]'
)
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      :class="{
        'max-w-[360px]': mdAndSmaller,
        'max-w-[480px]': !mdAndSmaller,
        'transform rotate-180': isBlackPov,
        'transform rotate-0': !isBlackPov,
        'outline outline-double outline-red-500': status === 'checkmate',
        'outline outline-double outline-yellow-500': status === 'check',
        'outline outline-double outline-indigo-500': status === 'stalemate',
      }">
      <div
        v-for="(row, y) in board.squares"
        :key="`row-${y}`"
        :class="mdAndSmaller ? 'h-[45px]' : 'h-[60px]'"
        class="mx-auto grid grid-cols-8">
        <span
          v-for="(_, x) in row"
          :key="`col-${x}`"
          :class="[squareColor(y, x), squareSize]"
          class="flex justify-center items-center"
          @click="handleSquareClick({ y, x } as Position)">
          <span
            v-if="chessPiece({ x, y } as Position, board)"
            :class="squareSize"
            class="w-full flex justify-center items-center">
            <component
              :is="chessPiece({ x, y } as Position, board) as ReturnType<typeof defineComponent>"
              :class="{
                'transform rotate-180': isBlackPov,
                'scale-75': mdAndSmaller,
              }" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
