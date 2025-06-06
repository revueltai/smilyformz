<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import ModalContainer from '@/components/shared/Modal/Container.vue'
  import Toast from '@/components/shared/Toast/index.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition>
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
</style>
