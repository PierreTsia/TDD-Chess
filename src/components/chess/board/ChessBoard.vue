<script lang="ts" setup>
import { useChessPieces } from '~/composables/chessPieces'
import { useChessGame } from '~/composables/chessGame'
import { useChessBoard } from '~/composables/chessBoard'
import { Position } from '~/core/types'

const { chessPiece } = useChessPieces()
const { board, status, start } = useChessGame()
const { squareColor, handleSquareClick } = useChessBoard()
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="max-w-[480px]"
      :class="{
        'outline outline-double outline-red-500': status === 'checkmate',
        'outline outline-double outline-yellow-500': status === 'check',
        'outline outline-double outline-indigo-500': status === 'stalemate',
      }">
      <div
        v-for="(row, y) in board.squares"
        :key="`row-${y}`"
        class="mx-auto grid grid-cols-8 h-[60px]">
        <span
          v-for="(_, x) in row"
          :key="`col-${x}`"
          :class="squareColor(y, x)"
          class="w-[60px] h-[60px] flex justify-center items-center"
          @click="handleSquareClick({ y, x } as Position)">
          <span
            v-if="chessPiece({ x, y } as Position, board)"
            class="w-full h-60px flex justify-center items-center">
            <component
              :is="chessPiece({ x, y } as Position, board) as ReturnType<typeof defineComponent>" />
          </span>
        </span>
      </div>
    </div>
    <o-button my-6 type="secondary" @click="start">
      {{ status === 'not_started' ? 'Start' : 'Reset' }}
    </o-button>
  </div>
</template>
