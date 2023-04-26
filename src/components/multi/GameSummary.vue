<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { formatDistanceToNowStrict } from 'date-fns'
import type { MultiplayerGameData } from '~/services/api'
import { useUserStore } from '~/stores/user'

defineProps<{
  game: MultiplayerGameData
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()
</script>

<template>
  <div :key="game.id" class="flex items-center justify-evenly w-full mb-4">
    <o-text size="sm" font="thin" class="w-1/4">
      {{ formatDistanceToNowStrict(new Date(game.created_at)) }}
      ago
    </o-text>
    <o-text
      size="sm"
      font="thin"
      class="w-1/4 flex justify-end mr-2"
      :class="{
        '!text-teal-500': game.white_player.id === user?.id,
      }">
      {{
        game.white_player.id === user?.id ? 'You' : game.white_player.username
      }}
      <o-icon class="ml-1 w-4" name="i-tabler:chess-filled" />
    </o-text>
    <o-text
      size="sm"
      font="thin"
      class="w-1/4 flex justify-start"
      :class="{
        '!text-teal-500': game.black_player.id === user?.id,
      }">
      <o-icon class="mr-1 w-4" name="i-tabler:chess" />
      {{
        game.black_player.id === user?.id ? 'You' : game.black_player.username
      }}
    </o-text>

    <o-button
      size="sm"
      class="w-1/4"
      @click="router.push(`multi/game/${game.id}`)">
      Join
    </o-button>
  </div>
</template>
