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
        <img src="pwa-512x512.png" class="w-[90px] h-[90px rounded-full">
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

<!--  <nav class="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-blueGray-800">
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start ">
        <a class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white" href="#">Notus JS</a><button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button" onclick="toggleNavbar('example-collapse-navbar')">
        <i class="text-white fas fa-bars"></i>
      </button>
      </div>
      <div id="example-collapse-navbar" class="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none hidden bg-blueGray-800">
        <ul class="flex flex-col lg:flex-row list-none mr-auto">
          <li class="flex items-center">
            <a class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="https://www.creative-tim.com/learning-lab/tailwind/js/overview/notus?ref=njs-register"><i class="lg:text-blueGray-200 text-blueGray-400 far fa-file-alt text-lg leading-lg mr-2"></i>
              Docs</a>
          </li>
        </ul>
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
          <li class="inline-block relative">
            <a class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="#pablo" onclick="openDropdown(event,'demo-pages-dropdown')">
              Demo Pages
            </a>
            <div id="demo-pages-dropdown" class="hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48">
            <span class="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400">
              Admin Layout
            </span>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Dashboard
              </a>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Settings
              </a>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Tables
              </a>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Maps
              </a>
              <div class="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
              <span class="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400">
              Auth Layout
            </span>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Login
              </a>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Register
              </a>
              <div class="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
              <span class="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400">
              No Layout
            </span>
              <a href="#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Landing
              </a>
              <a href=".#" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                Profile
              </a>
            </div>
          </li>
          <li class="flex items-center">
            <a class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-js%2F" target="_blank"><i class="lg:text-blueGray-200 text-blueGray-400 fab fa-facebook text-lg leading-lg"></i><span class="lg:hidden inline-block ml-2">Share</span></a>
          </li>
          <li class="flex items-center">
            <a class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-js%2F&amp;text=Start%20your%20development%20with%20a%20Free%20Tailwind%20CSS%20and%20JavaScript%20UI%20Kit%20and%20Admin.%20Let%20Notus%20JS%20amaze%20you%20with%20its%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level." target="_blank"><i class="lg:text-blueGray-200 text-blueGray-400 fab fa-twitter text-lg leading-lg"></i><span class="lg:hidden inline-block ml-2">Tweet</span></a>
          </li>
          <li class="flex items-center">
            <a class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold" href="https://github.com/creativetimofficial/notus-js?ref=njs-register" target="_blank"><i class="lg:text-blueGray-200 text-blueGray-400 fab fa-github text-lg leading-lg"></i><span class="lg:hidden inline-block ml-2">Star</span></a>
          </li>
          <li class="flex items-center">
            <a class="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150" href="https://www.creative-tim.com/product/notus-js?ref=njs-index" target="_blank">
              <i class="fas fa-arrow-alt-circle-down"></i> Download
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav> -->
</template>
