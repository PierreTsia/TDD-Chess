<script lang="ts" setup>
import { useChessGame } from '~/composables/chessGame'

const { start, status } = useChessGame()
</script>

<template>
  <div class="w-[400px]">
    <o-card >
      <template #default>
        <o-button my-6 mr-2 type="secondary" @click="start">
          {{ status === 'not_started' ? 'Start' : 'Reset' }}
        </o-button>
        <o-button light type="secondary">
          Secondary
        </o-button>
      </template>
    </o-card>
  </div>
</template>
