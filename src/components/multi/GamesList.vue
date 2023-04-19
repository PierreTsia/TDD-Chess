<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnlineGames } from '~/stores/online-games'

const props = defineProps<{
  userId: string
}>()

const onlineGamesStore = useOnlineGames()
const { onlineGames } = storeToRefs(onlineGamesStore)

onMounted(async () => {
  await onlineGamesStore.fetchOnlineGames(props.userId)
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[400px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Open Games (45)
      </o-text>
    </template>

    <div v-for="game in onlineGames" :key="game.id">{{ game.id }}</div>
  </o-card>
</template>
