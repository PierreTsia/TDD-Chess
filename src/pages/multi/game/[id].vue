<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GameChat from '~/components/multi/GameChat.vue'
import { useUserStore } from '~/stores/user'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useGamePlayStore } from '~/stores/game-play'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const onlineGamesStore = useOnlineGamesStore()
const gamePlayStore = useGamePlayStore()

const chatStore = useChatStore()
const { user } = storeToRefs(userStore)
const { currentGame } = storeToRefs(onlineGamesStore)

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
      await gamePlayStore.initOnlineGame(id as string)
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="flex flex-col w-100vw h-[calc(100vh-150px)] py-10">
    <div v-if="currentGame" class="flex flex-wrap w-full mt-4 h-screen">
      <div class="flex gap-x-12 w-full !md:w-2/3 justify-center items-start">
        <div class="flex flex-col gap-y-10">
          <ScoreBoard />
          <ControlPanel />
        </div>
        <ChessBoard />
      </div>
      <div class="w-full !md:w-1/3 px-2">
        <GameChat />
      </div>
    </div>
  </div>
</template>
