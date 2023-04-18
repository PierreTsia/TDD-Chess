<script lang="ts" setup>
import { useChessGame } from '~/composables/chessGame'

const { status, currentPlayer, players, materialScore, winner } = useChessGame()

const opponentMaterialScore = (color: 'white' | 'black') => {
  const opponentColor = color === 'white' ? 'black' : 'white'
  return materialScore.value[opponentColor]
}
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
            {{ p?.name }}
          </o-text>
        </div>
      </template>
      <template #default>
        <ul
          class="w-full flex flex-wrap justify-center items-center px-10 gap-y-1">
          <li v-show="status === 'ongoing'" class="w-full flex start gap-x-6">
            <o-text size="sm" type="secondary">Playing :</o-text>
            <o-text size="sm" class="flex items-center">
              <o-icon
                class="mr-1 w-4"
                :name="
                  currentPlayer.color === 'white'
                    ? 'i-tabler:chess-filled'
                    : 'i-tabler:chess'
                " />{{ currentPlayer?.name }}
            </o-text>
          </li>
          <li class="w-full flex justify-start gap-x-6">
            <o-text size="sm" type="secondary">Game Status :</o-text>
            <o-text v-if="winner" size="sm">{{ winner?.name }} won ! </o-text>
            <o-text v-else-if="status === 'stalemate'" size="sm">Draw </o-text>
            <o-text v-else-if="status === 'not_started'" size="sm"
              >Ready !</o-text
            >
            <o-text v-else size="sm">{{ status }}</o-text>
          </li>
          <li
            v-show="status === 'ongoing'"
            class="w-full flex justify-start gap-x-6">
            <o-text size="sm" type="secondary">Material Score :</o-text>
            <span
              v-for="p in players"
              :key="`materialScore-${p.color}`"
              class="flex justify-center items-center">
              <o-icon
                class="w-4"
                :name="
                  p.color === 'black'
                    ? 'i-tabler:chess-filled'
                    : 'i-tabler:chess'
                " />
              <o-text size="sm">{{ opponentMaterialScore(p.color) }}</o-text>
            </span>
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
