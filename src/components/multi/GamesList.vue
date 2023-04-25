<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { formatDistanceToNowStrict } from 'date-fns'
import { useOnlineGamesStore } from '~/stores/online-games'
import { MultiplayerGameData } from '~/services/api'

const props = defineProps<{
  userId: string
}>()

const router = useRouter()

const onlineGamesStore = useOnlineGamesStore()
const { onlineGames } = storeToRefs(onlineGamesStore)

onMounted(async () => {
  await onlineGamesStore.fetchOnlineGames(props.userId)
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[400px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Open Games ({{ onlineGames.length }})
      </o-text>
    </template>

    <div
      v-for="game in onlineGames"
      :key="game.id"
      class="flex items-center justify-evenly w-full mb-4">
      <o-text size="sm" font="thin" class="w-1/4">
        {{
          formatDistanceToNowStrict(
              new Date((game as MultiplayerGameData).created_at)
          )
        }}
        ago
      </o-text>
      <o-text
        size="sm"
        font="thin"
        class="w-1/4 flex justify-end mr-2"
        :class="{
        '!text-teal-500': (game as MultiplayerGameData).white_player.id === userId,
      }">
        {{
          (game as MultiplayerGameData).white_player.id === userId
              ? 'You'
              : (game as MultiplayerGameData).white_player.username
        }}
        <o-icon class="ml-1 w-4" name="i-tabler:chess-filled" />
      </o-text>
      <o-text
        size="sm"
        font="thin"
        class="w-1/4 flex justify-start"
        :class="{
        '!text-teal-500': (game as MultiplayerGameData).black_player.id === userId,
      }">
        <o-icon class="mr-1 w-4" name="i-tabler:chess" />
        {{
          (game as MultiplayerGameData).black_player.id === userId
              ? 'You'
              : (game as MultiplayerGameData).black_player.username
        }}
      </o-text>

      <o-button
        size="sm"
        class="w-1/4"
        @click="router.push(`multi/game/${game.id}`)">
        Join
      </o-button>
    </div>
  </o-card>
</template>
