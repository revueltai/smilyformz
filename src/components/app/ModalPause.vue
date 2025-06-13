<script setup lang="ts">
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import { useRouter } from 'vue-router'

  const emit = defineEmits(['resume'])

  const router = useRouter()

  function handleHome() {
    router.push('/home')
  }

  function handleResume() {
    emit('resume')
  }
</script>

<template>
  <SettingsSound />

  <ModalControls
    class="mt-4"
    @home="handleHome"
    @click="handleResume"
  />
</template>
