<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import GameSummary from '~/components/multi/GameSummary.vue'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const onlineGamesStore = useOnlineGamesStore()
const { onlineGames } = storeToRefs(onlineGamesStore)

onMounted(async () => {
  await onlineGamesStore.fetchOnlineGames(user.value?.id as string)
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[400px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Open Games ({{ onlineGames.length }})
      </o-text>
    </template>

    <GameSummary v-for="game in onlineGames" :key="game.id" :game="game" />
  </o-card>
</template>
