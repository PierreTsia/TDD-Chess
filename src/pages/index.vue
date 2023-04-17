<script setup lang="ts">
import ChessBoard from '~/components/chess/board/ChessBoard.vue'
import ScoreBoard from '~/components/chess/ScoreBoard.vue'
import ControlPanel from '~/components/chess/ControlPanel.vue'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div>
    <div text-4xl flex justify-center mb-4>
      <h1 mr-2>Chess</h1>
      <div class="i-fluent:chess-20-filled" text-indigo-400 inline-block />
    </div>
    <div
      class="flex flex-col md:flex-row w-full justify-center items-center md:items-start! gap-x-8">
      <ChessBoard />
      <div flex flex-col gap-y-3>
        <ScoreBoard />
        <ControlPanel />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
