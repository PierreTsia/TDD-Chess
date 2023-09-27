<script setup lang="ts">
import { storeToRefs } from 'pinia'
import supabase from '~/modules/supabase'
import { useUserStore } from '~/stores/user'
import { useChatStore } from '~/stores/chat'
import { useOnlineGamesStore } from '~/stores/online-games'
import { useMultiplayerChessGameStore } from '~/stores/multiplayer-chess-game'
import { useGameEventsStore } from '~/stores/game-events'
import { useChessBoard } from '~/composables/chessBoard'
import type { Panel } from '~/types'
import MobileActionBar from '~/components/MobileActionBar.vue'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const onlineGamesStore = useOnlineGamesStore()
const multiplayerChessGameStore = useMultiplayerChessGameStore()
const gameEventsStore = useGameEventsStore()

const { onlineUsers } = storeToRefs(gameEventsStore)

const { isBlackPov } = useChessBoard()

const chatStore = useChatStore()
const {
  moveHistory,
  board,
  status,
  lastMove,
  mePlaysBlack,
  materialScore,
  currentPlayer,
  onlinePlayers,
  winner,
} = storeToRefs(multiplayerChessGameStore)
const { user } = storeToRefs(userStore)
const { currentGame } = storeToRefs(onlineGamesStore)

const isLoading = ref(false)

const activePanel = ref<Panel>('game')
const setActivePanel = (panel: Panel) => {
  activePanel.value = panel
}

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

onUnmounted(() => {
  gameEventsStore.unsubscribeFromPresence(
    route.params.id as string,
    user.value?.id as string
  )
})

watch(
  () => [route.params.id, user.value?.id],
  async ([gameId, userId]) => {
    if (gameId && userId) {
      await onlineGamesStore.setCurrentGame(gameId as string)
      await chatStore.fetchChatMessages(gameId as string)
      await multiplayerChessGameStore.initOnlineGame(gameId as string)
      gameEventsStore.setGameId(gameId as string)
      gameEventsStore.subscribeToGameEvents()
      gameEventsStore.subscribeToPresence(gameId as string, userId as string)
      isLoading.value = false
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div
    class="flex flex-col w-100vw min-h-calc(100vh-120px) xl:60vw mx-auto pt-2 pb-[120px] !xl:pb-10">
    <MobileActionBar
      class="flex !xl:hidden"
      :active-panel="activePanel"
      @on-panel-click="setActivePanel" />
    <div class="">
      <div
        v-if="!isLoading && currentGame"
        class="flex flex-col gap-y-12 xl:flex-row flex-wrap w-full max-w-[1600px] mx-auto px-0 !xl:px-10 mt-4 min-h-[calc(100vh-250px)]">
        <div class="flex flex-col items-center gap-y-4 !xl:w-3/12 !w-full px-2">
          <ScoreBoard
            :material-score="materialScore"
            :current-player="currentPlayer"
            :players="onlinePlayers"
            :status="status"
            :online-users="onlineUsers"
            :winner="winner" />
          <OnlineControlPanel class="hidden !xl:flex" />
          <MoveHistory
            class="hidden xl:flex max-h-[400px] !w-[400px]"
            :moves="moveHistory" />
        </div>
        <div class="flex flex-col items-center !w-full !xl:w-6/12 xl: gap-y-4">
          <div v-if="activePanel === 'game'" class="flex flex-col gap-y-12">
            <ChessBoard
              :board="board"
              :status="status"
              :last-move="lastMove"
              :is-black-pov="isBlackPov"
              :me-plays-black="mePlaysBlack"
              :is-multiplayer="true" />
            <OnlineControlPanel class="flex !xl:hidden mx-auto" />
          </div>

          <GameChat v-if="activePanel === 'chat'" class="!max-w-[640px]" />

          <MoveHistory
            v-if="activePanel === 'history'"
            class="flex xl:hidden max-w-[640px]"
            :moves="moveHistory" />
        </div>
        <div class="hidden !xl:flex flex-col items-center !w-full !xl:w-3/12">
          <GameChat class="!max-w-[500px] max-h-[640px]" />
        </div>
      </div>
      <div v-else-if="!isLoading">
        <h1>NO GAME</h1>
      </div>
    </div>
  </div>
</template>
