<script setup lang="ts">
  import type { FootnoteProps } from './types'

  withDefaults(defineProps<FootnoteProps>(), {
    footnoteColor: 'slate-400',
  })
</script>

<template>
  <div
    v-if="footnote || error"
    class="flex flex-col gap-0.5 text-xs text-start"
  >
    <p
      v-if="error"
      class="text-rose-600"
    >
      {{ error }}
    </p>

    <p
      v-if="footnote"
      :class="`text-${footnoteColor}`"
    >
      {{ footnote }}
    </p>
  </div>
</template>
