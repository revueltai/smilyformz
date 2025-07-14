<script setup lang="ts">
  import { computed } from 'vue'
  import { isFullscreen } from '@/utils'

  defineProps<{
    disabled?: boolean
  }>()

  const directions = ['left', 'right'] as const

  const cssClasses = computed(() => (isFullscreen() ? 'bottom-2' : 'bottom-14'))
</script>

<template>
  <div
    class="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 w-full gap-4 px-3"
    :class="cssClasses"
  >
    <div
      v-for="direction in directions"
      :key="direction"
      :class="direction === 'left' ? 'text-left' : 'text-right'"
    >
      <Button
        size="2xl"
        :disabled="disabled"
        @touchstart="$emit(`move-${direction}`)"
      >
        <Icon
          size="lg"
          :name="`arrow-${direction}`"
          :color="disabled ? 'slate-400' : 'slate-700'"
        />
      </Button>
    </div>
  </div>
</template>
