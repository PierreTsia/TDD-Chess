<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LoginCard from '~/components/auth/LoginCard.vue'
import UserCard from '~/components/auth/UserCard.vue'
import GamesList from '~/components/multi/GamesList.vue'
import OnlineGameInvitationsList from '~/components/multi/OnlineGameInvitationsList.vue'
import PlayersList from '~/components/multi/PlayersList.vue'
import Statistics from '~/components/multi/Statistics.vue'
import supabase from '~/modules/supabase'
import { PlayerStatistics } from '~/modules/types/supabase'
import { SupabaseService } from '~/services/api'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isLoading = ref(false)

const stats = ref<PlayerStatistics | null>(null)

onBeforeMount(async () => {
  isLoading.value = true
  if (!user.value) {
    const { data } = await supabase.auth.getSession()

    if (data?.session?.user?.id) {
      await userStore.getUserFromId(data.session.user.id)
      const api = new SupabaseService()
      stats.value = await api.getPlayerAnalytics(data.session.user.id)
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
        <Statistics v-if="stats" :stats="stats as PlayerStatistics" />
        <PlayersList />
        <OnlineGameInvitationsList />
        <GamesList />
      </div>
    </div>
  </div>
</template>
