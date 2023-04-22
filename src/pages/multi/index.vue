<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LoginCard from '~/components/auth/LoginCard.vue'
import UserCard from '~/components/auth/UserCard.vue'
import GamesList from '~/components/multi/GamesList.vue'
import PlayersList from "~/components/multi/PlayersList.vue";
import supabase from '~/modules/supabase'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isLoading = ref(false)

onBeforeMount(async () => {
  isLoading.value = true
  if (!user.value) {
    const { data } = await supabase.auth.getSession()

    if (data?.session?.user?.id) {
      await userStore.getUserFromId(data.session.user.id)
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
        <PlayersList />
        <GamesList :user-id="user?.id" />
      </div>
    </div>
  </div>
</template>
