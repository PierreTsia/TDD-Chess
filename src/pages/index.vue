<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ChessBoard from '~/components/chess/board/ChessBoard.vue'
import ScoreBoard from '~/components/chess/ScoreBoard.vue'
import ControlPanel from '~/components/chess/ControlPanel.vue'

import { useUserStore } from '~/stores/user'

defineOptions({
  name: 'IndexPage',
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

userStore.fetchUser('alice@example.com', 'testtest')
</script>

<template>
  <div>
    <div text-4xl flex justify-center mb-4>
      <div class="i-fluent:chess-20-filled" text-teal-400 inline-block />

      <h1 mx-2>Welcome {{ user?.username }}</h1>
      <div class="i-fluent:chess-20-filled" text-teal-400 inline-block />
    </div>
    <div
      class="flex flex-col md:flex-row w-full justify-center items-center md:items-start! gap-8">
      <ChessBoard data-test-id="chessboard" />
      <div flex flex-col gap-3>
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
