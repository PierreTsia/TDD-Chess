<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChessGameStore } from '~/stores/chess-game'
const chessGameStore = useChessGameStore()

const {
  board,
  status,
  isBlackPov,
  lastMove,
  players,
  currentPlayer,
  materialScore,
  winner,
} = storeToRefs(chessGameStore)
onMounted(() => {
  chessGameStore.initSoloGame()
})
</script>

<template>
  <div class="mt-10">
    <div
      class="flex flex-col lg:flex-row w-full justify-center items-center !lg:items-start gap-8">
      <client-only>
        <ChessBoard
          :board="board"
          :is-black-pov="isBlackPov"
          :last-move="lastMove"
          :me-plays-black="false"
          :status="status" />
        <div flex flex-col gap-3>
          <ScoreBoard
            :status="status"
            :players="players"
            :material-score="materialScore"
            :winner="winner"
            :online-users="[]"
            :current-player="currentPlayer" />
          <ControlPanel />
        </div>
      </client-only>
    </div>
  </div>
</template>
