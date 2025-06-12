<script setup lang="ts">
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import GameControls from '@/components/app/GameControls.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function handleHome() {
    router.push('/home')
  }

  function handleResume() {
    router.push('/game')
  }
</script>

<template>
  <SettingsSound />

  <GameControls
    class="mt-4"
    @home="handleHome"
    @click="handleResume"
  />
</template>
