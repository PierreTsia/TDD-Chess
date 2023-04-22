<script setup lang="ts">
import md5 from 'md5'
import type { OnlinePlayer } from '~/services/api'

const props = withDefaults(
  defineProps<{
    user: OnlinePlayer | null
    size?: 'sm' | 'md' | 'lg'
    rounded?: boolean
  }>(),
  {
    size: 'md',
    rounded: true,
  }
)
const avatarSrc = computed(
  () => `https://www.gravatar.com/avatar/${md5(props.user?.email ?? '')}`
)
</script>

<template>
  <o-avatar :rounded="rounded" :size="size" :src="avatarSrc" />
</template>
