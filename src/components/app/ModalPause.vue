<script setup lang="ts">
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import { useModalStore } from '@/stores/modal.store'
  import { MODALS } from '@/configs/constants'

  const emit = defineEmits(['resume'])
  const modalStore = useModalStore()

  function handleHome() {
    modalStore.closeModal()
    modalStore.openModal(MODALS.QUIT_CONFIRM)
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
