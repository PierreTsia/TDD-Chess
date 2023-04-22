<script setup lang="ts"></script>

<template>
  <div class="mt-10">
    <div
      class="flex flex-col lg:flex-row w-full justify-center items-center !lg:items-start gap-8">
      <client-only>
        <ChessBoard />
        <div flex flex-col gap-3>
          <ScoreBoard />
          <ControlPanel />
        </div>
      </client-only>
    </div>
  </div>
</template>
