<script lang="ts" setup>
import { Position } from '~/core/types';
import type { GameStatus, IBoard, IMove } from '~/core/types'
import { useBreakPoints } from '~/composables/breakPoints'
import { useChessPieces } from '~/composables/chessPieces'
const props = defineProps<{
  board: IBoard
  status: GameStatus
  isBlackPov: boolean
  mePlaysBlack: boolean
  lastMove?: IMove
}>()

const gamePlayStore = useGamePlayStore()

const { chessPiece } = useChessPieces()
const { handleSquareClick, isSelected } = useChessBoard()

watch(
  () => props.mePlaysBlack,
  (mePlaysBlack) => {
    if (
      (mePlaysBlack && !props.isBlackPov) ||
      (!mePlaysBlack && props.isBlackPov)
    ) {
      gamePlayStore.switchPoV()
    }
  },
  {
    immediate: true,
  }
)

const { mobile, tablet, desktop } = useBreakPoints()

const squareSize = computed(() => {
  if (mobile.value) {
    return 'w-[45px] h-[45px]'
  } else if (tablet.value) {
    return 'w-[60px] h-[60px]'
  }
  return 'w-[80px] h-[80px]'
})

const squareHeight = computed(() => {
  return squareSize.value.split(' ')[1]
})
const isEven = (num: number) => num % 2 === 0

const squareColor = (y: number, x: number) => {
  if (isSelected(x, y)) {
    return 'bg-blue-400'
  } else if (
    props.lastMove &&
    props.lastMove.endPosition.x === x &&
    props.lastMove.endPosition.y === y
  ) {
    return 'bg-amber-300 border border-white'
  }
  return isEven(y) === isEven(x) ? 'bg-gray-200' : 'bg-gray-400'
}
</script>

<template>
  <div
    data-test-id="chessboard"
    :class="{
      'transform rotate-180': isBlackPov,
      'transform rotate-0': !isBlackPov,
    }"
    class="flex flex-col items-center justify-center">
    <div
      :class="{
        'max-w-[360px]': mobile,
        'max-w-[640px]': desktop,
        'max-w-[480px]': tablet,
        'outline outline-double outline-red-500': status === 'checkmate',
        'outline outline-double outline-yellow-500': status === 'check',
        'outline outline-double outline-indigo-500': status === 'stalemate',
      }">
      <div
        v-for="(row, y) in board.squares"
        :key="`row-${y}`"
        :class="squareHeight"
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
                'scale-75': mobile,
                'scale-100': tablet,
                'scale-135': desktop,
              }"
              data-test-id="chess-piece" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
