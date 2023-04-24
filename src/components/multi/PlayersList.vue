<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOnlineGamesStore } from '~/stores/online-games'

const router = useRouter()

const onlineGamesStore = useOnlineGamesStore()
const { availableOpponents } = storeToRefs(onlineGamesStore)

const selectedPlayerId = ref<string | null>(null)

const selectedPlayerName = computed(() => {
  const player = availableOpponents.value.find(
    (player) => player.id === selectedPlayerId.value
  )
  return player?.username ?? ''
})

const setSelectPlayerId = (id: string | null) => {
  selectedPlayerId.value = id
}

const handlePlayerClick = (id: string) => {
  const newSelectedPlayerId = selectedPlayerId.value === id ? null : id
  setSelectPlayerId(newSelectedPlayerId)
}

const handleCreateGame = () => {
  if (!selectedPlayerId.value) {
    return
  }
  onlineGamesStore.createGame(selectedPlayerId.value, (gameId: string) =>
    router.push(`/multi/game/${gameId}`)
  )
  setSelectPlayerId(null)
}

onMounted(async () => {
  await onlineGamesStore.fetchOnlinePlayers()
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[200px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Online Players ({{ availableOpponents.length }})
      </o-text>
    </template>

    <div class="flex items-center gap-4 justify-center w-full mb-4">
      <div
        v-for="player in availableOpponents"
        :key="player.id"
        class="mx-3 flex flex-col justify-center items-center gap-y-1"
        @click="handlePlayerClick(player.id)">
        <Avatar
          :user="player"
          size="md"
          :class="{
            'border-2 border-teal-500': selectedPlayerId === player.id,
            'opacity-75 border-2 border-gray-300':
              selectedPlayerId !== player.id,
          }" />
        <o-text size="xs">{{ player.username }}</o-text>
        <span class="w-2 h-2 rounded-full bg-green-400" />
      </div>
    </div>
    <template #actions>
      <o-button
        :disabled="!selectedPlayerId"
        type="success"
        class="w-[300px]"
        @click="handleCreateGame">
        {{
          !selectedPlayerId
            ? 'Select a player to start a game'
            : `Start a game with ${selectedPlayerName}`
        }}
      </o-button>
    </template>
  </o-card>
</template>
