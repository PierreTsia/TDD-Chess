<script lang="ts" setup>
import type { IMove } from '~/core/types'

import { useChessPieces } from '~/composables/chessPieces'

const props = withDefaults(
  defineProps<{
    moves: Array<IMove>
  }>(),
  {
    moves: () => [],
  }
)
const { pieces } = useChessPieces()

type MovePair = [IMove, IMove?]

const movesPaires = computed(() => {
  return props.moves
    .reduce((acc, move, i) => {
      if (i % 2 === 0) {
        acc.push([move])
      } else {
        acc[acc.length - 1].push(move)
      }
      return acc
    }, [] as Array<MovePair>)
    .reverse()
})

const generateCoords = (position: { x: number; y: number }) => {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].reverse()
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8].reverse()
  return `${letters[position.x]}${numbers[position.y]}`
}

const reverseIndex = (i: number) => movesPaires.value.length - i
</script>

<template>
  <o-card class="">
    <div
      v-for="(pair, i) in movesPaires"
      :key="i"
      class="flex justify-even items-center w-full">
      <span class="inline-flex w-2/12 text-left"> {{ reverseIndex(i) }}: </span>
      <span class="inline-flex w-5/12">
        <component :is="pieces[pair[0].piece.type].white" class="h-6" />
        <span>{{ generateCoords(pair[0].startPosition) }}</span>
        -
        <span>{{ generateCoords(pair[0].endPosition) }}</span>
      </span>

      <span v-if="pair[1]" class="w-5/12 inline-flex">
        <component :is="pieces[pair[1].piece.type].black" class="h-6" />
        <span>{{ generateCoords(pair[1].startPosition) }}</span>
        -
        <span>{{ generateCoords(pair[1].endPosition) }}</span>
      </span>
    </div>
  </o-card>
</template>
