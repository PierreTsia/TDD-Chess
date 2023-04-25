<script setup lang="ts">
useHead({
  title: 'Online Chess Game',
  meta: [
    {
      name: 'description',
      content:
        'Written in Typescript, built with Vue, powered by Supabase and hosted by Netlify',
    },
    {
      name: 'theme-color',
      content: computed(() => (isDark.value ? '#00aba9' : '#ffffff')),
    },
  ],

  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon2.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
