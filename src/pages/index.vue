<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const router = useRouter()

defineOptions({
  name: 'IndexPage',
})

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
</script>

<template>
  <div>
    <div text-4xl flex justify-center items-center my-4>
      <o-icon name="i-fluent:chess-20-filled" class="!text-teal-400 mx-2" />
      <o-text size="xl" mx-2>Welcome {{ user?.username }}</o-text>
      <o-icon name="i-fluent:chess-20-filled" class="!text-teal-400 mx-2" />
    </div>
    <div class="w-full flex mt-6 justify-center gap-4">
      <o-button
        data-test-id="multiplayer-page-btn"
        link
        @click="router.push('/multi')">
        Play Online
      </o-button>
      <o-button
        data-test-id="playground-page-btn"
        link
        @click="router.push('/playground')">
        Practice
      </o-button>
    </div>
  </div>
</template>
