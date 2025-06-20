<script setup lang="ts">
  import Icon from '@/components/shared/Icon/index.vue'

  defineProps<{
    isConfirmed: boolean
  }>()
</script>

<template>
  <div
    v-if="!isConfirmed"
    class="flex flex-col gap-2 items-center justify-center mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg"
  >
    <div class="flex items-center gap-2">
      <Icon
        name="triangle-alert"
        color="rose-800"
        size="md"
      />

      <p class="text-rose-800 text-sm font-medium">
        {{ $t('emailNotConfirmed') }}
      </p>
    </div>

    <p class="text-rose-600 text-center text-xs">
      {{ $t('emailNotConfirmedDescription') }}
    </p>
  </div>
</template>
