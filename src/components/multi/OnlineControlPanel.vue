<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useGamePlayStore } from '~/stores/game-play'

const gamePlayStore = useGamePlayStore()
const { switchPoV, resignGame } = gamePlayStore
const { isBlackPov, isGameOver } = storeToRefs(gamePlayStore)


</script>

<template>
  <div class="w-[400px]">
    <o-card>
      <template #default>
        <div
          class="flex flex-col items-center flex-wrap justify-center gap-x-4">
          <div class="w-full flex flex-row justify-center items-center">
            <o-button
              data-test-id="start-button"
              type="success"
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

          <div class="w-full flex flex-row justify-center items-center gap-4">
            <!--            <o-button :disabled="!lastMove" type="success" @click="undo">
              <o-icon
                name="i-solar:square-double-alt-arrow-left-outline"
                class="!text-white" />
            </o-button>
            <o-button
              :disabled="!lastCancelledMove"
              type="success"
              @click="redo">
              <o-icon
                name="i-solar:square-double-alt-arrow-right-linear"
                class="!text-white" />
            </o-button> -->
          </div>
        </div>
      </template>
    </o-card>
  </div>
</template>
