<script lang="ts" setup>
import md5 from 'md5'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const avatarSrc = computed(
  () => `https://www.gravatar.com/avatar/${md5(user.value?.email ?? '')}`
)
</script>

<template>
  <o-card class="!w-[300px]">
    <div class="flex justify-center mb-3">
      <o-avatar rounded size="lg" :src="avatarSrc"> </o-avatar>
    </div>
    <o-text class="!text-teal !mb-2" size="xl" font="bold">
      Welcome {{ user?.username }}
    </o-text>
    <o-text
      size="sm"
      font="thin"
      class="!flex items-center justify-center"
      @click="userStore.logOut">
      <o-icon name="i-solar:logout-3-bold-duotone mr-1" />
      Log out
    </o-text>
  </o-card>
</template>
