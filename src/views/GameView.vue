<script setup lang="ts">
  import { ref } from 'vue'
  import { useModalStore } from '@/stores/modal.store'
  import { MODALS } from '@/configs/constants'
  import GameHeader from '@/components/app/GameHeader.vue'
  import ModalPause from '@/components/app/ModalPause.vue'
  import GameBoard from '@/components/app/GameBoard.vue'

  const TILE_COLORS = {
    color1: '#00BCFF',
    color2: '#0099FF',
    color3: '#0077FF',
    color4: '#0055FF',
    color5: '#0033FF',
    color6: '#0011FF',
    color7: '#0000FF',
  }

  const modalStore = useModalStore()
  const time = ref('00:00')
  const score = ref(0)

  function handlePause() {
    modalStore.openModal(MODALS.PAUSE)
  }

  function handleResume() {
    modalStore.closeModal()
  }
</script>

<template>
  <div class="relative h-full py-0 px-3">
    <GameHeader
      :time="time"
      :score="score"
      @pause="handlePause"
    />

    <GameBoard :active-tile-color="TILE_COLORS.color1" />

    <Modal
      :name="MODALS.PAUSE"
      :heading="$t('gamePaused')"
    >
      <ModalPause @resume="handleResume" />
    </Modal>
  </div>
</template>
