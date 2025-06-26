<script setup lang="ts">
  import { useUserStore } from '@/stores/user.store'

  const userStore = useUserStore()
</script>

<template>
  <div class="flex flex-col items-center gap-2 bg-sky-200 rounded-xl pt-3 pb-1.5 px-1.5 shadow-xs">
    <h2 class="text-xs uppercase text-blue-950">
      {{ $t('yourLeague') }}
    </h2>

    <div
      class="flex w-full justify-center items-center gap-3 rounded-md bg-white text-slate-900 py-3.5 px-4 h"
    >
      <img
        :src="`/images/leagues/${userStore.leagueLevel.id}.svg`"
        alt="League badge"
        class="w-10 h-10"
      />

      <p class="text-base font-bold text-blue-950">{{ $t(userStore.leagueLevel.name) }}</p>
    </div>
  </div>
</template>
