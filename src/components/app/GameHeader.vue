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
  <div class="absolute left-0 top-0 w-full z-20">
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

      <div class="flex items-center justify-end gap-3">
        <Button @click="$emit('tutorial')">
          <Icon name="help" />
        </Button>

        <Button
          border-color="blue-500"
          border-color-hover="blue-400"
          background-color="blue-50"
          background-color-hover="blue-100"
          color="white"
          @click="$emit('pause')"
        >
          <Icon
            name="pause"
            color="blue-500"
          />
        </Button>
      </div>
    </div>
  </div>
</template>
