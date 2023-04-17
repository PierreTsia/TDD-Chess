<script lang="ts" setup>
import { useChessGame } from '~/composables/chessGame'
import { useChessBoard } from '~/composables/chessBoard'

const { start, status } = useChessGame()
const { switchPov, isBlackPov } = useChessBoard()
</script>

<template>
  <div class="w-[400px]">
    <o-card>
      <template #default>
        <div class="flex items-center justify-center gap-x-4">
          <o-button type="error" my-6 mr-2 @click="start">
            {{ status === 'not_started' ? 'Start' : 'Reset' }}
          </o-button>
          <o-button type="info"  @click="switchPov">
            <o-icon name="i-ph:arrows-clockwise-bold" class="!text-white" />
            Switch to {{ isBlackPov ? 'White' : 'Black' }}
          </o-button>
        </div>
      </template>
    </o-card>
  </div>
</template>
