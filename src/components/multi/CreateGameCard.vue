<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOnlineGamesStore } from '~/stores/online-games'

const onlineGamesStore = useOnlineGamesStore()
const { onlinePayers } = storeToRefs(onlineGamesStore)

onMounted(async () => {
  await onlineGamesStore.fetchOnlinePlayers()
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[200px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Create new game
      </o-text>
    </template>

    <div class="flex items-center flex-col justify-evenly w-full mb-4">
      <input
        type="text"
        autocomplete="user"
        placeholder="username"
        class="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200" />

      <span v-for="player in onlinePayers" :key="player.id">
        {{ player.username }}
      </span>
    </div>
  </o-card>
</template>
