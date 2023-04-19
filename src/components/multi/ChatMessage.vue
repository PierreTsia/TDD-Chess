<script setup lang="ts">
import { storeToRefs } from 'pinia'
import md5 from 'md5'
import { formatDistanceToNow } from 'date-fns'
import type { GameChatMessage } from '~/services/api'
import { useUserStore } from '~/stores/user'

const props = defineProps<{
  message: GameChatMessage
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOwnMessage = computed(() => user.value?.id === props.message.user_id)
const avatarSrc = computed(
  () => `https://www.gravatar.com/avatar/${md5(props.message.user.email)}`
)
</script>

<template>
  <div
    class="flex items-end mb-4 w-full"
    :class="isOwnMessage ? 'justify-start' : 'justify-end'">
    <div
      class="py-1 px-4 text-white text-sm flex flex-col w-8/10"
      :class="[
        isOwnMessage
          ? 'bg-blue-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl order-2 ml-2'
          : 'bg-green-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl mr-2',
      ]">
      <o-text
        class="!text-white w-full"
        :class="isOwnMessage ? 'text-left' : 'text-right'"
        font="bold"
        >{{ message.content }}</o-text
      >
      <o-text class="!text-gray-200 w-full" size="xs">
        {{ formatDistanceToNow(new Date(message.created_at)) }} ago
      </o-text>
    </div>
    <img :src="avatarSrc" class="object-cover h-6 w-6 rounded-full" alt="" />
  </div>
</template>
