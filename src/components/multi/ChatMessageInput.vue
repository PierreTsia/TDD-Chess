<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'onSendMessage', content: string): void
}>()
const messageContent = ref('')
const send = () => {
  emit('onSendMessage', messageContent.value)
  messageContent.value = ''
}
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
