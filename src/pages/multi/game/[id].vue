<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useOnlineGamesStore } from '~/stores/online-games'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const onlineGamesStore = useOnlineGamesStore()
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
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="flex flex-col w-100vw h-[calc(100vh-150px)] py-10">
    <h1>Game {{ route.params.id }}</h1>
    <div v-if="currentGame">{{ currentGame?.created_at }}</div>
    <div v-if="currentGame">{{ currentGame?.white_player?.username }}</div>
    <div v-if="currentGame">{{ currentGame?.black_player?.username }}</div>
  </div>
</template>
