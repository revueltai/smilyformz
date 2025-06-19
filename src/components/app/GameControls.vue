<script setup lang="ts">
  defineProps<{
    disabled?: boolean
  }>()
</script>

<template>
  <div>
    <Button
      size="xl"
      class="absolute left-2 bottom-14 z-20"
      :disabled="disabled"
      @click="$emit('move-left')"
    >
      <Icon
        size="md"
        name="arrow-left"
        :color="disabled ? 'slate-400' : 'slate-700'"
      />
    </Button>

    <Button
      size="xl"
      class="absolute right-2 bottom-14 z-20"
      :disabled="disabled"
      @click="$emit('move-right')"
    >
      <Icon
        size="md"
        name="arrow-right"
        :color="disabled ? 'slate-400' : 'slate-700'"
      />
    </Button>
  </div>
</template>
