<script setup lang="ts">
  withDefaults(
    defineProps<{
      time: string
      score: number
    }>(),
    {
      time: '00:00',
      score: 0,
    },
  )
</script>

<template>
  <div class="fixed left-0 top-0 w-full z-20">
    <div
      class="flex justify-between items-center gap-3 w-full h-full bg-white p-3 border-b border-slate-300 shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div>
          <div class="block text-slate-400 text-xs">{{ $t('time') }}</div>
          <div class="text-blue-500 w-12">{{ time }}</div>
        </div>

        <div>
          <div class="block text-slate-400 text-xs">{{ $t('score') }}</div>
          <div class="text-blue-500">{{ score }} {{ $t('points') }}</div>
        </div>
      </div>

      <Button @click="$emit('pause')">
        <Icon name="pause" />
      </Button>
    </div>
  </div>
</template>
