<script setup lang="ts"></script>

<template>
  <o-card class="!max-w-[800px] mt-10 min-h-[200px] rounded">
    <template #header>
      <o-text size="xl" font="bold" class="w-full !text-teal-500"
        >Create new game
      </o-text>
    </template>

    <div class="flex items-center justify-evenly w-full mb-4">
      <input
        type="text"
        autocomplete="user"
        placeholder="username"
        class="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200" />
    </div>
  </o-card>
</template>
