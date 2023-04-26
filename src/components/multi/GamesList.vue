<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { formatDistanceToNowStrict } from 'date-fns'
import { useOnlineGamesStore } from '~/stores/online-games'
import { MultiplayerGameInviteData } from '~/services/api'

const props = defineProps<{
  userId: string
}>()

const router = useRouter()

const onlineGamesStore = useOnlineGamesStore()
const { gameInvites } = storeToRefs(onlineGamesStore)

onMounted(async () => {
await onlineGamesStore.fetchGameInvites()
  await onlineGamesStore.fetchOnlineGames(props.userId)
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[200px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Invitations ({{ gameInvites.length }})
      </o-text>
    </template>

    <div
      v-for="invite in gameInvites"
      :key="invite.id"
      class="flex items-center justify-evenly w-full mb-4">
      <o-text size="sm" font="thin" class="w-1/4">
        {{
          formatDistanceToNowStrict(
            new Date((invite as MultiplayerGameInviteData).created_at)
          )
        }}
        ago
      </o-text>
      <o-text
        size="sm"
        font="thin"
        class="w-1/4 flex justify-end mr-2"
        :class="{
        '!text-teal-500': (invite as MultiplayerGameInviteData).white_player.id === userId,
      }">
        {{
          (invite as MultiplayerGameInviteData).white_player.id === userId
            ? 'You'
            : (invite as MultiplayerGameInviteData).white_player.username
        }}
        <o-icon class="ml-1 w-4" name="i-tabler:chess-filled" />
      </o-text>
      <o-text
        size="sm"
        font="thin"
        class="w-1/4 flex justify-start"
        :class="{
        '!text-teal-500': (invite as MultiplayerGameInviteData).black_player.id === userId,
      }">
        <o-icon class="mr-1 w-4" name="i-tabler:chess" />
        {{
          (invite as MultiplayerGameInviteData).black_player.id === userId
            ? 'You'
            : (invite as MultiplayerGameInviteData).black_player.username
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
