<script setup lang="ts">
import { storeToRefs } from 'pinia'
import LoginCard from '~/components/auth/LoginCard.vue'
import { supabase } from '~/modules/supabase'
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
    class="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
    <LoginCard v-if="!isLoading && !user" />
    <div v-else-if="!isLoading">
      <o-text class="!text-teal" size="xl" font="bold">
        Welcome {{ user?.username }}
      </o-text>
    </div>
  </div>
</template>
