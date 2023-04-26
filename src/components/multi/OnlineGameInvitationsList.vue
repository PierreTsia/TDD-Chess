<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import OnlineGameInvitation from '~/components/multi/OnlineGameInvitation.vue'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useUserStore } from '~/stores/user'

const onlineGamesStore = useOnlineGamesStore()
const userStore = useUserStore()
const { gameInvites, sortedInvites } = storeToRefs(onlineGamesStore)
const { user } = storeToRefs(userStore)

const myInvitations = computed(() => sortedInvites.value[0])
const otherPlayersInvitations = computed(() => sortedInvites.value[1])

onMounted(async () => {
  await onlineGamesStore.fetchGameInvites()
  onlineGamesStore.subscribeToInvitations()
  await onlineGamesStore.fetchOnlineGames(user.value?.id as string)
})
</script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[200px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Invitations ({{ gameInvites.length }})
      </o-text>
    </template>

    <div v-if="myInvitations.length" class="flex flex-col">
      <span class="w-full my-2">My Invites</span>
      <OnlineGameInvitation
        v-for="invitation in myInvitations"
        :key="invitation.id"
        :invitation="invitation" />
    </div>

    <div v-if="otherPlayersInvitations.length" class="flex flex-col">
      <span class="w-full">Challenges from other users</span>

      <OnlineGameInvitation
        v-for="invitation in otherPlayersInvitations"
        :key="invitation.id"
        :invitation="invitation" />
    </div>
  </o-card>
</template>
