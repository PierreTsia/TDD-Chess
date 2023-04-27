<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LoginCard from '~/components/auth/LoginCard.vue'
import UserCard from '~/components/auth/UserCard.vue'
import GamesList from '~/components/multi/GamesList.vue'
import OnlineGameInvitationsList from '~/components/multi/OnlineGameInvitationsList.vue'
import PlayersList from '~/components/multi/PlayersList.vue'
import supabase from '~/modules/supabase'
import type { PlayerStatistics } from '~/modules/types/supabase'
import { SupabaseService } from '~/services/api'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isLoading = ref(false)

const analytics = ref<PlayerStatistics | null>(null)

const percentageOfWins = computed<number>(() => {
  if (!analytics.value) {
    return 0
  }
  return +(
    (analytics.value.wins! / analytics.value.total_games!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsWhite = computed<number>(() => {
  if (!analytics.value) {
    return 0
  }
  return +(
    (analytics.value.wins_as_white! / analytics.value.wins!) *
    100
  ).toFixed(1)
})

const percentageOfWinsAsBlack = computed<number>(() => {
  if (!analytics.value) {
    return 0
  }
  return +(
    (analytics.value.wins_as_black! / analytics.value.wins!) *
    100
  ).toFixed(1)
})

onBeforeMount(async () => {
  isLoading.value = true
  if (!user.value) {
    const { data } = await supabase.auth.getSession()

    if (data?.session?.user?.id) {
      await userStore.getUserFromId(data.session.user.id)
      const api = new SupabaseService()
      analytics.value = await api.getPlayerAnalytics(data.session.user.id)
    }
  }
  isLoading.value = false
})
</script>

<template>
  <div
    class="min-h-[calc(100vh-100px)] flex flex-col justify-start pt-20 items-center">
    <div v-if="!isLoading">
      <LoginCard v-if="!user" />
      <div v-else class="flex flex-col items-center w-[100vw] px-4">
        <UserCard />
        <o-card class="mt-4 w-full flex flex-col gap-y-4 !max-w-[600px]">
          <template #header>
            <o-text
              size="xl"
              font="bold"
              class="!text-teal-500 w-full text-center"
              >Your online history</o-text
            >
          </template>

          <div class="flex flex-col gap-y-2">
            <o-text size="sm" class="w-full text-left"
              >Win ratio ({{ analytics?.wins }}/{{
                analytics?.total_games
              }})</o-text
            >
            <o-progress
              :percentage="percentageOfWins"
              stroke-width="lg"
              :color="percentageOfWins > 50 ? 'success' : 'warning'"
              :bg-color="percentageOfWins > 50 ? 'success' : 'warning'"
              striped />
            <o-text size="sm" class="w-full text-left"
              >Win as white ({{ analytics?.wins_as_white }}/{{
                analytics?.wins
              }})</o-text
            >
            <o-progress
              :percentage="percentageOfWinsAsWhite"
              stroke-width="lg"
              :color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
              :bg-color="percentageOfWinsAsWhite > 50 ? 'success' : 'warning'"
              striped />
            <o-text size="sm" class="w-full text-left"
              >Win as Black ({{ analytics?.wins_as_black }}/{{
                analytics?.wins
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
        <PlayersList />
        <OnlineGameInvitationsList />
        <GamesList />
      </div>
    </div>
  </div>
</template>
