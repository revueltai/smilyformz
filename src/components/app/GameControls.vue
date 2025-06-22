<script setup lang="ts">
  import { computed } from 'vue'
  import { isFullscreen } from '@/utils'

  defineProps<{
    disabled?: boolean
  }>()

  const directions = ['left', 'right'] as const

  const cssClasses = computed(() => (isFullscreen() ? 'bottom-2' : 'bottom-16'))
</script>

<template>
  <div>
    <Button
      v-for="direction in directions"
      size="xl"
      class="absolute z-20"
      :class="cssClasses + ` ${direction === 'left' ? 'left-2' : 'right-2'}`"
      :disabled="disabled"
      @click="$emit(`move-${direction}`)"
    >
      <Icon
        size="md"
        :name="`arrow-${direction}`"
        :color="disabled ? 'slate-400' : 'slate-700'"
      />
    </Button>
  </div>
</template>
