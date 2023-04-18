<script setup lang="ts">
// @ts-expect-error types are not available for this package
import * as md5 from 'md5'
import { storeToRefs } from 'pinia'
import LoginCard from '~/components/auth/LoginCard.vue'
import { supabase } from '~/modules/supabase'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isLoading = ref(false)

const avatarSrc = computed(
  () => `https://www.gravatar.com/avatar/${md5(user.value?.email)}`
)

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
    <div v-if="!isLoading">
      <LoginCard v-if="!user" />

      <div v-else class="flex flex-col">
        <div class="w-full flex justify-center mb-3">
          <o-avatar rounded size="lg" :src="avatarSrc"> </o-avatar>
        </div>
        <o-text class="!text-teal !mb-2" size="xl" font="bold">
          Welcome {{ user?.username }}
        </o-text>
        <o-text
          size="sm"
          font="thin"
          class="flex items-center"
          @click="userStore.logOut">
          <o-icon name="i-solar:logout-3-bold-duotone mr-1" />
          Log out
        </o-text>
      </div>
    </div>
  </div>
</template>
