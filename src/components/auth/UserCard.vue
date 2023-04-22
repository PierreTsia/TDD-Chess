<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import Avatar from '~/components/user/Avatar.vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
</script>

<template>
  <o-card class="!w-[300px]">
    <div class="flex justify-center mb-3">
      <Avatar :user="user" size="lg" rounded="false" />
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
