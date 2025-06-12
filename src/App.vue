<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import ModalContainer from '@/components/shared/Modal/Container.vue'
  import Toast from '@/components/shared/Toast/index.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      name="fade"
      mode="out-in"
    >
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <ModalContainer />
  <Toast />
</template>

<style>
  #app {
    @apply w-screen h-screen;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
