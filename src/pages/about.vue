<script setup lang="ts">
import { SQL_COMMANDS } from '~/pages/SQL_COMMANDS'
</script>

<template>
  <div class="flex flex-col space-y-6 max-w-[900px] mx-auto bg-gray-100 dark:bg-opacity-10 rounded p-4">
    <!-- Title section -->
    <h2 class="text-4xl font-bold">About</h2>

    <section class="space-y-4 fscw flex flex-col text-left">
      <p class="break-normal">
        This project is a Chess engine implemented in TypeScript, which began as
        a personal challenge to be accomplished during my free time.
      </p>
      <p class="break-normal">
        The primary goal of the project was to practice Test-Driven Development
        (TDD) on a more advanced level than the usual bowling or fizzbuzz katas.
      </p>
      <p class="break-normal">
        After completing the initial implementation, I decided to take it a step
        further and explore the feasibility of turning the engine into a
        multiplayer game.
      </p>
    </section>

    <!-- Install section -->
    <section class="space-y-4 flex flex-col items-start">
      <div class="flex items-center space-x-2.5">
        <o-text
          class="inline-flex items-center bold capitalize space-x-2 text-xl">
          <img src="supabase.svg" alt="supabase" class="w-8 h-8" />
          <span>Supabase</span>
        </o-text>
      </div>

      <!-- Instructions list -->
      <ol class="list-decimal list-inside text-left pl-8">
        <li>
          Create a new project on
          <a href="https://supabase.io/" class="text-blue-400 hover:underline"
            >Supabase</a
          >.
        </li>
        <li>
          Copy the <code class="text-red-600 text-sm">.env.example</code> file
          to <code class="text-red-600 text-sm">.env</code> and fill in the
          values. (see supabase documentation for more info on how to get the
          values for your project)
        </li>
        <li>
          Set up the required tables and policies either using supabase GUI or
          by running the following command on supabase query editor:
        </li>
        <!-- ... Other list items ... -->

        <!-- SQL Commands -->
        <details class="my-4 border rounded-lg w-full">
          <summary
            class="cursor-pointer bg-gray-200 dark:bg-gray-800 p-2 rounded-t-lg">
            See SQL Commands
          </summary>

          <pre class="text-left"><code>{{ SQL_COMMANDS }}</code></pre>
        </details>

        <li>
          Enable supabase realtime functionalities :
          <code class="text-red-600 text-sm"
            >database->replications->supabase_realtime
          </code>
          : select the above created tables
        </li>
      </ol>
    </section>
    <!-- Development section -->
    <section class="space-y-4 flex flex-col items-start">
      <div class="flex items-center space-x-2.5">
        <o-text
          class="inline-flex items-center bold capitalize space-x-2 text-xl">
          <img src="typescript.svg" alt="typescript" class="w-8 h-8" />
          <img src="vue.svg" alt="vuejs" class="w-8 h-8" />
          <img src="vite.svg" alt="vite" class="w-8 h-8" />
          <span>Development</span>
        </o-text>
      </div>

      <!-- Instructions list -->
      <ol class="list-decimal list-inside text-left pl-8">
        <li>
          Install dependencies and run the app
          <code class="text-red-600 text-sm">npm i && npm run dev</code> : your
          app should be running on
          <code class="text-red-600 text-sm">http://localhost:3333</code>
        </li>

        <li>
          To build the app run
          <code class="text-red-600 text-sm">npm run build</code> : vite will
          bundle your files in the
          <code class="text-red-600 text-sm">dist</code> that is ready to be
          served.
        </li>
      </ol>
    </section>
    <!-- Deploy section -->
    <section class="space-y-4 flex flex-col items-start">
      <div class="flex items-center space-x-2.5">
        <o-text
          class="inline-flex items-center bold capitalize space-x-2 text-xl">
          <img src="netlify.svg" alt="netlify" class="w-8 h-8" />
          <img v-if="isDark" src="github-mark-white.svg" alt="github" class="w-8 h-8" />
          <img v-else src="github-mark.svg" alt="github" class="w-8 h-8" />
          <span>Deploy</span>
        </o-text>
      </div>

      <!-- Instructions list -->
      <ol class="list-decimal list-inside text-left pl-8">
        <li>
          Create a new project on
          <a
            class="text-blue-400 hover:underline"
            href="https://www.netlify.com/"
            target="_blank"
            >Netlify</a
          >
        </li>

        <li>
          Get your netlify
          <code class="text-red-600 text-sm">NETLIFY_AUTH_TOKEN</code> and
          <code class="text-red-600 text-sm">NETLIFY_SITE_ID</code> from
          <a
            class="text-blue-400 hover:underline"
            href="https://docs.netlify.com/cli/get-started/#obtain-a-token-in-the-netlify-ui"
            >your netlify account settings</a
          >
        </li>
        <li>
          Add the above variables to to your
          <a
            class="text-blue-400 hover:underline"
            href="https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository"
            >github repository secrets</a
          >
        </li>
        <li>
          Add supabase variables defined in your local
          <code class="text-red-600 text-sm">.env</code> file to your github
          repository secrets
        </li>
        <li>
          Finally add those same supabase variables
          <a
            class="text-blue-400 hover:underline"
            href="https://docs.netlify.com/configure-builds/environment-variables/"
            >to your netlify environment variables</a
          >
        </li>
      </ol>

      <p class="text-left">
        The action defined in
        <code class="text-red-600 text-sm">./.github/workflows/ci.yml</code>
        will run on every push to the main branch, run
        <code class="text-red-600 text-sm">lint</code>,
        <code class="text-red-600 text-sm">typecheck</code>,
        <code class="text-red-600 text-sm">test:unit</code> and
        <code class="text-red-600 text-sm">test:e2e</code> and will build and
        deploy the app to netlify 🚀 if all tests pass ✅.
      </p>
    </section>
  </div>
</template>

<style scoped>
.sql-hl-keyword {
  color: #a626a4;
}
</style>
