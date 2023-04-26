<script lang="ts" setup>
import { formatDistanceToNowStrict } from 'date-fns'
import { storeToRefs } from 'pinia'
import type { MultiplayerGameInviteData } from '~/services/api'
import { useUserStore } from '~/stores/user'

const props = defineProps<{
  invitation: MultiplayerGameInviteData
}>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isUserHost = computed(() => {
  return user.value?.id === props.invitation.white_player.id
})
</script>

<template>
  <div
    :key="invitation.id"
    class="flex items-center justify-evenly w-full mb-4">
    <o-text size="sm" font="thin" class="w-1/4">
      {{ formatDistanceToNowStrict(new Date(invitation.created_at)) }}
      ago
    </o-text>
    <o-text
      size="sm"
      font="thin"
      class="w-1/4 flex justify-end mr-2"
      :class="{
        '!text-teal-500': invitation.white_player.id === user?.id,
      }">
      {{
        invitation.white_player.id === user?.id
          ? 'You'
          : invitation.white_player.username
      }}
      <o-icon class="ml-1 w-4" name="i-tabler:chess-filled" />
    </o-text>
    <o-text
      size="sm"
      font="thin"
      class="w-1/4 flex justify-start"
      :class="{
        '!text-teal-500': invitation.black_player.id === user?.id,
      }">
      <o-icon class="mr-1 w-4" name="i-tabler:chess" />
      {{
        invitation.black_player.id === user.id
          ? 'You'
          : invitation.black_player.username
      }}
    </o-text>

    <o-button
      size="sm"
      class="w-1/4"
      @click="router.push(`multi/game/${invitation.game_id}`)">
      {{ isUserHost ? 'Play' : 'Accept' }}
    </o-button>
  </div>
</template>
