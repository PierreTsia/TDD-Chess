<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GameChat from '~/components/multi/GameChat.vue'
import OnlineControlPanel from '~/components/multi/OnlineControlPanel.vue'
import supabase from '~/modules/supabase'
import { useUserStore } from '~/stores/user'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useGamePlayStore } from '~/stores/game-play'
import { useGameEventsStore } from '~/stores/game-events'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const onlineGamesStore = useOnlineGamesStore()
const gamePlayStore = useGamePlayStore()
const gameEventsStore = useGameEventsStore()

const chatStore = useChatStore()
const { user } = storeToRefs(userStore)
const { currentGame } = storeToRefs(onlineGamesStore)

const isLoading = ref(false)

onBeforeMount(async () => {
  isLoading.value = true
  if (!user.value) {
    const { data } = await supabase.auth.getSession()

    if (data?.session?.user?.id) {
      await userStore.getUserFromId(data.session.user.id)
      if (!user.value) {
        await router.push('/')
        isLoading.value = false
      }
    }
  }
})

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await onlineGamesStore.setCurrentGame(id as string)
      await chatStore.fetchChatMessages(id as string)
      await gamePlayStore.initOnlineGame(id as string)
      gameEventsStore.setGameId(id as string)
      gameEventsStore.subscribeToGameEvents()
      isLoading.value = false
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="flex flex-col w-100vw xl:60vw mx-auto py-10">
    <div
      v-if="!isLoading && currentGame"
      class="flex flex-col gap-y-4 xl:flex-row flex-wrap w-full max-w-[1600px] mx-auto px-0 !xl:px-10 mt-4 min-h-screen">
      <div class="flex flex-col items-center gap-y-4 !xl:w-3/12 !w-full">
        <ScoreBoard />
        <OnlineControlPanel />
      </div>
      <div class="flex flex-col !w-full !xl:w-6/12">
        <ChessBoard />
      </div>
      <div class="flex flex-col items-center !w-full !xl:w-3/12">
        <GameChat class="!max-w-[500px]" />
      </div>
    </div>
  </div>
</template>
