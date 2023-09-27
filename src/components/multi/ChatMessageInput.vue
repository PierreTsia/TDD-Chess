<script lang="ts" setup>
import { useKeyboardShortCuts } from '~/composables/kbShortcuts'

const emit = defineEmits<{
  (e: 'onSendMessage', content: string): void
}>()

const { onEnterKey } = useKeyboardShortCuts()
const messageContent = ref('')
const send = () => {
  if (!messageContent.value) {
    return
  }
  emit('onSendMessage', messageContent.value)
  messageContent.value = ''
}

onEnterKey(send)
</script>

<template>
  <div class="py-5 w-full flex gap-x-2 justify-start items-center">
    <input
      v-model="messageContent"
      class="w-9/10 bg-gray-300 py-5 px-3 rounded-xl"
      type="text"
      placeholder="type your message here..." />
    <o-button type="warning" icon="i-mdi-send" @click="send" />
  </div>
</template>
