<script setup lang="ts">
  withDefaults(
    defineProps<{
      label: string
      value: string | number
      hasShareButton?: boolean
    }>(),
    {
      hasShareButton: true,
    },
  )
</script>

<template>
  <div class="flex justify-between items-center">
    <p class="text-sm">
      {{ label }}
    </p>

    <div class="flex items-center gap-2">
      <p class="">
        <span class="text-lg uppercase font-bold">{{ value }}</span>
        <span class="text-xs text-slate-500 ml-1">{{ $t('points') }}</span>
      </p>

      <Button
        v-if="hasShareButton"
        size="sm"
        @click="$emit('click')"
      >
        <Icon
          name="share-2"
          size="sm"
          color="slate-700"
        />
      </Button>
    </div>
  </div>
</template>
