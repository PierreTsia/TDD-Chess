<script lang="ts" setup></script>

<template>
  <o-card class="!w-[400px] flex flex-col" divider>
    <template #header>
      <div class="flex flex-row items-center gap-2">
        <o-icon name="i-solar:login-2-bold-duotone" class="!text-teal-400" />
        <o-text class="text-xl font-bold">Login</o-text>
      </div>
    </template>
    <form action="">
      <div class="flex flex-col items-start mb-10">
        <label for="email" class="px-2 text-sm text-teal-400 font-bold"
          >Email</label
        >
        <input
          id="email"
          type="text"
          autocomplete="alice@example.com"
          placeholder="@horizon.ui"
          class="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200" />
      </div>
      <div class="flex flex-col items-start">
        <label for="email" class="px-2 text-sm text-teal-400 font-bold"
          >Password</label
        >
        <input
          id="password"
          type="password"
          autocomplete="testtest"
          placeholder="password"
          class="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200" />
      </div>
    </form>

    <template #actions>
      <div class="flex flex-row justify-end gap-2">
        <o-button type="info" class="!w-[100px]">Login</o-button>
        <o-button type="error" class="!w-[100px]">Cancel</o-button>
      </div>
    </template>
  </o-card>
</template>
