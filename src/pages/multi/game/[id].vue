<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GameChat from '~/components/multi/GameChat.vue'
import { useUserStore } from '~/stores/user'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const onlineGamesStore = useOnlineGamesStore()
const chatStore = useChatStore()
const { user } = storeToRefs(userStore)
const { currentGame } = storeToRefs(onlineGamesStore)
onMounted(async () => {})

onBeforeMount(async () => {
  if (!user.value) {
    await router.push('/multi')
  }
})

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await onlineGamesStore.setCurrentGame(id as string)
      await chatStore.fetchChatMessages(id as string)
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="flex flex-col w-100vw h-[calc(100vh-150px)] py-10">
    <div class="mt-10 text-xl text-teal-500">Game {{ route.params.id }}</div>
    <div v-if="currentGame" class="flex flex-wrap w-full mt-4 h-screen">
      <div class="w-full !md:w-3/4">board</div>
      <div class="w-full !md:w-1/4 px-2">
        <GameChat />
      </div>
    </div>
  </div>
</template>
