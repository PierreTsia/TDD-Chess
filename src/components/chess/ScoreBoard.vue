<script lang="ts" setup>
import { useChessGame } from '~/composables/chessGame'

const { status, currentPlayer, players } = useChessGame()
</script>

<template>
  <div class="w-[400px]">
    <o-card>
      <template #header>
        <div class="flex justify-center items-center w-full gap-4">
          <o-text v-for="p in players" :key="p.color" class="flex items-center">
            <o-icon
              class="mr-1"
              :name="
                p.color === 'white'
                  ? 'i-tabler:chess-king-filled'
                  : 'i-tabler:chess-king'
              " />
            {{ p.name }}
          </o-text>
        </div>
      </template>
      <template #default>
        <ul
          class="w-full flex flex-wrap justify-center items-center px-6 gap-y-1">
          <li class="w-full flex justify-center gap-x-6">
            <o-text size="sm" type="secondary">Playing :</o-text>
            <o-text size="sm">{{ currentPlayer?.color }} </o-text>
          </li>
          <li class="w-full flex justify-center gap-x-6">
            <o-text size="sm" type="secondary">Game Status :</o-text>
            <o-text size="sm">{{ status }} </o-text>
          </li>
        </ul>
      </template>

      <template #actions>
        <div fbc un-children="flex items-center justify-center gap-2">
          <div gap-4>
            <div>
              <o-icon cursor-pointer name="i-carbon-star" />
            </div>
            <div>
              <o-icon cursor-pointer name="i-carbon-share" />
            </div>
            <div>
              <o-icon cursor-pointer name="i-carbon-face-wink-filled" />
            </div>
          </div>
        </div>
      </template>
    </o-card>
  </div>
</template>