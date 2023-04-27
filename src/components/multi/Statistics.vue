<script lang="ts" setup>
import type { PlayerStatistics } from '~/modules/types/supabase'

const props = defineProps<{
  stats: PlayerStatistics
}>()

const percentageOfWins = computed<number>(() => {
  if (!props.stats) {
    return 0
  }
  return +(
    (props.stats.wins! / props.stats.total_games!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsWhite = computed<number>(() => {
  if (!props.stats) {
    return 0
  }
  return +(
    (props.stats.wins_as_white! / props.stats.wins!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsBlack = computed<number>(() => {
  if (!props.stats) {
    return 0
  }
  return +(
    (props.stats.wins_as_black! / props.stats.wins!) *
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
        >Win ratio ({{ stats?.wins }}/{{ stats?.total_games }})</o-text
      >
      <o-progress
        :percentage="percentageOfWins"
        stroke-width="lg"
        :color="percentageOfWins > 50 ? 'success' : 'warning'"
        :bg-color="percentageOfWins > 50 ? 'success' : 'warning'"
        striped />
      <o-text size="sm" class="w-full text-left"
        >Win as white ({{ stats?.wins_as_white }}/{{
          stats?.wins
        }})</o-text
      >
      <o-progress
        :percentage="percentageOfWinsAsWhite"
        stroke-width="lg"
        :color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
        :bg-color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
        striped />
      <o-text size="sm" class="w-full text-left"
        >Win as Black ({{ stats?.wins_as_black }}/{{
          stats?.wins
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
