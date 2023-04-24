<script setup lang="ts">
const router = useRouter()

defineOptions({
  name: 'IndexPage',
})

const multiplayerContent =
  'Create a game and invite your friends to play with you. You can also join a game created by your friends.'

const playgroundContent =
  'Playground free mode to test chess engine. If you spot any illegal moves, please report it on GitHub.'
</script>

<template>
  <div class="flex h-[calc(100vh-55px)] flex-col justify-center items-center">
    <h1
      class="mb-12 text-4xl font-extrabold leading-none tracking-tight !text-teal-400 md:text-5xl lg:text-6xl dark:text-white">
      TDD Chess Game
    </h1>
    <div class="w-full flex justify-center gap-x-8">
      <o-card
        divider
        title="Playground mode"
        :content="playgroundContent"
        class="!max-w-[300px] divider o-card-hoverable">
        <template #actions>
          <o-button
            data-test-id="playground-page-btn"
            link
            @click="router.push('/playground')">
            Practice
          </o-button>
        </template>
      </o-card>
      <o-card
        divider
        hoverable
        title="Multiplayer mode"
        :content="multiplayerContent"
        class="!max-w-[300px] o-card-hoverable">
        <template #actions>
          <o-button
            data-test-id="multiplayer-page-btn"
            link
            @click="router.push('/multi')">
            Play Online
          </o-button>
        </template>
      </o-card>
    </div>
  </div>
</template>
