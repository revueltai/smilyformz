<script setup lang="ts">
  import { computed } from 'vue'
  import { getRandomNumber } from '@/utils'
  import { useUserStore } from '@/stores/user.store'

  const props = defineProps<{
    position: number
    username: string
    score: number | string
    country?: string
  }>()

  const userStore = useUserStore()

  const cssClassesPosition = computed(() => {
    switch (props.position) {
      case 1:
        return 'bg-amber-400 border-amber-300 text-white'

      case 2:
        return 'bg-slate-400 border-slate-300 text-white'

      case 3:
        return 'bg-yellow-600 border-yellow-500 text-white'

      default:
        return `bg-transparent border-transparent`
    }
  })
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 uppercase text-xs px-3 py-2"
    :class="
      username === userStore.displayName
        ? 'bg-blue-200 text-blue-800 font-bold rounded-lg shadow-xs'
        : 'bg-transparent text-slate-400'
    "
  >
    <div class="flex items-center gap-2">
      <span
        :class="cssClassesPosition"
        class="w-6 h-6 flex items-center justify-center rounded-lg border"
      >
        {{ position }}
      </span>

      <img
        v-if="country"
        :src="`/images/flags/${country}.svg`"
        width="24"
        height="24"
        class="rounded-full w-6 h-6"
      />

      <Icon
        v-else
        size="md"
        name="globe"
      />

      <div class="truncate max-w-[150px]">{{ username }}</div>
    </div>

    <span class="font-bold">{{ score }} {{ $t('points') }}</span>
  </div>
</template>
