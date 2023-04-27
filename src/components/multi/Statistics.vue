<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnlineGamesStore } from '~/stores/online-games'

const onlineGamesStore = useOnlineGamesStore()
const { statistics } = storeToRefs(onlineGamesStore)

onBeforeMount(async () => {
  await onlineGamesStore.fetchUserStatistics()
})

const percentageOfWins = computed<number>(() => {
  if (!statistics.value) {
    return 0
  }
  return +(
    (statistics.value.wins! / statistics.value.total_games!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsWhite = computed<number>(() => {
  if (!statistics.value) {
    return 0
  }
  return +(
    (statistics.value.wins_as_white! / statistics.value.wins!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsBlack = computed<number>(() => {
  if (!statistics.value) {
    return 0
  }
  return +(
    (statistics.value.wins_as_black! / statistics.value.wins!) *
    100
  ).toFixed(1)
})
</script>

<template>
  <o-card class="mt-4 w-full flex flex-col gap-y-4 !max-w-[600px]">
    <template #header>
      <o-text size="xl" font="bold" class="!text-teal-500 w-full text-center"
        >Statistics</o-text
      >
    </template>

    <div class="flex flex-col gap-y-2">
      <o-text size="sm" class="w-full text-left"
        >Win ratio ({{ statistics?.wins }}/{{
          statistics?.total_games
        }})</o-text
      >
      <o-progress
        :percentage="percentageOfWins"
        stroke-width="lg"
        :color="percentageOfWins > 50 ? 'success' : 'warning'"
        :bg-color="percentageOfWins > 50 ? 'success' : 'warning'"
        striped />
      <o-text size="sm" class="w-full text-left"
        >Win as white ({{ statistics?.wins_as_white }}/{{
          statistics?.wins
        }})</o-text
      >
      <o-progress
        :percentage="percentageOfWinsAsWhite"
        stroke-width="lg"
        :color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
        :bg-color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
        striped />
      <o-text size="sm" class="w-full text-left"
        >Win as Black ({{ statistics?.wins_as_black }}/{{
          statistics?.wins
        }})</o-text
      >
      <o-progress
        :percentage="percentageOfWinsAsBlack"
        stroke-width="lg"
        :color="percentageOfWinsAsBlack > 50 ? 'success' : 'warning'"
        :bg-color="percentageOfWinsAsBlack > 50 ? 'success' : 'warning'"
        striped />
    </div>
  </o-card>
</template>
