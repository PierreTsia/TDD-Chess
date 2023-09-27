<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useMultiplayerChessGameStore } from '~/stores/multiplayer-chess-game'
import { useChessBoard } from '~/composables/chessBoard'

const multiplayerChessGameStore = useMultiplayerChessGameStore()
const { switchPoV, isBlackPov } = useChessBoard()
const { resignGame } = multiplayerChessGameStore
const { isGameOver } = storeToRefs(multiplayerChessGameStore)
</script>

<template>
  <div class="w-full max-w-[400px]">
    <o-card>
      <template #default>
        <div
          class="flex flex-col items-center flex-wrap justify-center gap-x-4">
          <div class="w-full flex flex-row justify-center items-center">
            <o-button
              data-test-id="start-button"
              type="error"
              my-6
              mr-2
              :disabled="isGameOver"
              @click="resignGame">
              Resign
            </o-button>
            <o-button
              data-test-id="switch-pov-button"
              type="info"
              @click="switchPoV">
              <o-icon name="i-ph:arrows-clockwise-bold" class="!text-white" />
              Switch to {{ isBlackPov ? 'White' : 'Black' }}
            </o-button>
          </div>

          <div
            class="w-full flex flex-row justify-center items-center gap-4"></div>
        </div>
      </template>
    </o-card>
  </div>
</template>
