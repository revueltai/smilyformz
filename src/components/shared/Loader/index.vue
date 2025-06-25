<script setup lang="ts">
  import { createCssVar } from '@/utils'
  import type { LoaderProps } from './type'

  const props = withDefaults(defineProps<LoaderProps>(), {
    color: '#155DFC',
    size: 'md',
  })

  const sizes = {
    sm: 4,
    md: 8,
    lg: 10,
    xl: 16,
  }
</script>

<template>
  <div class="flex items-center justify-center my-8">
    <div
      class="loader rounded-full animate-spin"
      :class="`w-${sizes[size]} h-${sizes[size]}`"
      :style="[
        createCssVar('color-base', '#0000'),
        createCssVar('color-loader', `var(--color-${props.color})`),
        createCssVar('loader-size', `${sizes[props.size]}px`),
      ]"
    />
  </div>
</template>

<style scoped>
  .loader {
    mask: radial-gradient(
      farthest-side,
      var(--color-base) calc(100% - var(--loader-size)),
      var(--color-loader) 0
    );
    background:
      radial-gradient(farthest-side, var(--color-loader) 94%, var(--color-base))
        top/var(--loader-size) var(--loader-size) no-repeat,
      conic-gradient(var(--color-base) 30%, var(--color-loader));
  }
</style>
