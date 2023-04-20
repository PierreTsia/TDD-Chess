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
/* useGamePlayStore() */
const { user } = storeToRefs(userStore)

userStore.fetchUser('alice@example.com', 'testtest')
</script>

<template>
  <div>
    <div text-4xl flex justify-center items-center mb-4>
      <o-icon name="i-fluent:chess-20-filled" class="!text-teal-400 mx-2" />
      <o-text size="xl" mx-2>Welcome {{ user?.username }}</o-text>
      <o-icon name="i-fluent:chess-20-filled" class="!text-teal-400 mx-2" />
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
