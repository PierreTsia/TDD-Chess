<script setup lang="ts">
import ChessBoard from '~/components/chess/board/ChessBoard.vue'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div>
    <div text="3xl" flex justify-center mb-4>
      <h1 mr-2>Chess</h1>
      <div class="i-fluent:chess-20-filled" text-indigo-400 inline-block />
    </div>

    <ChessBoard />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
