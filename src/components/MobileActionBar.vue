<script lang="ts" setup>
defineProps<{
  activePanel: Panel
}>()

defineEmits<{
  (event: 'onPanelClick', panel: Panel): void
}>()
const PANELS = ['history', 'game', 'chat'] as const
export type Panel = (typeof PANELS)[number]

const panelIcon: Record<Panel, string> = {
  history: 'i-tdesign-history',
  game: 'i-fa6-solid-chess',
  chat: 'i-ic-round-wechat',
}
</script>

<template>
  <div
    class="w-full z-1000 flex items-center justify-center p-4 bg-[#ffffff] dark:bg-[#1d1e1f] fixed xl:hidden h-[80px] border-t border-t-2 border-t-solid border-purple-500 bottom-0 gap-x-2">
    <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
      <li
        v-for="(p, i) in PANELS"
        :key="i"
        class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
        <a
          class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          :class="{
            'text-white outline-2 outline-solid outline-white bg-purple-400':
              activePanel === p && isDark,
            'text-white bg-purple-900': activePanel !== p && isDark,
            'text-gray-800 bg-gray-300': activePanel !== p && !isDark,
            'text-white bg-purple-500 outline outline-2 outline-purple-700':
              activePanel === p && !isDark,
          }"
          @click="$emit('onPanelClick', p)">
          <o-icon cursor-pointer :name="panelIcon[p]" />
          {{ p[0].toUpperCase() + p.slice(1) }}
        </a>
      </li>
    </ul>
  </div>
</template>
