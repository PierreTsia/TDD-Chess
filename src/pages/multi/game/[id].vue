<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GameChat from '~/components/multi/GameChat.vue'
import OnlineControlPanel from '~/components/multi/OnlineControlPanel.vue'
import supabase from '~/modules/supabase'
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
      class="grid grid-cols-12 gap-4 w-full mt-4 min-h-screen px-0 !md:px-10">
      <div
        class="justify-self-center col-span-12 xl:col-span-3 !xl:col-start-2 flex flex-col gap-y-6">
        <ScoreBoard />
        <OnlineControlPanel />
      </div>
      <div class="w-full !justify-self-center col-span-12 xl:col-span-6">
        <ChessBoard />
      </div>
      <div
        class="w-full col-span-8 !col-start-3 !md:col-span-6 !md:col-start-4 !xl:col-span-2 !justify-self-center">
        <GameChat />
      </div>
    </div>
  </div>
</template>
