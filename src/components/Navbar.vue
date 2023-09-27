<script lang="ts" setup>
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t, locale } = useI18n()

const toggleLocales = async () => {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}
</script>

<template>
  <nav class="">
    <div class="container mx-auto py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-50">
       <o-icon name="i-fa6-solid-chess" class="w-[54px] h-[54px] !text-teal-400"/>
      </h1>
      <div class="flex space-x-10">
        <div class="flex items-center space-x-2">
          <RouterLink class="icon-btn mx-2" to="/" :title="t('button.home')">
            <div i-carbon-campsite />
          </RouterLink>

        </div>
        <div class="flex items-center space-x-2">
          <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
            <div i="carbon-sun dark:carbon-moon" />
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales()">
            <div i-carbon-language />
          </a>
        </div>
        <div class="flex items-center space-x-2">
          <RouterLink class="icon-btn mx-2" to="/about" :title="t('button.about')">
            <div i-carbon-dicom-overlay />
          </RouterLink>
        </div>
        <div class="flex items-center space-x-2">
          <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/PierreTsia/TDD-Chess" target="_blank" title="GitHub">
            <div i-carbon-logo-github />
          </a>
        </div>
      </div>

    </div>
  </nav>


</template>
