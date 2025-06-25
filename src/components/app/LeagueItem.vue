<script setup lang="ts">
  import { computed } from 'vue'
  import type { GameLeagueLevelKey } from '@/types/game'

  interface Props {
    league: {
      id: GameLeagueLevelKey
      name: string
      totalRowsLength: number
      isCurrent: boolean
      isAvailable: boolean
      pointsToUnlock?: number | null
      nextLevelPoints?: number | null
    }
    showArrow?: boolean
    isNextAvailable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showArrow: false,
    isNextAvailable: false,
  })

  const emit = defineEmits<{
    select: [leagueKey: GameLeagueLevelKey]
  }>()

  function handleClick() {
    if (props.league.isAvailable) {
      emit('select', props.league.id)
    }
  }
</script>

<template>
  <div class="relative flex-shrink-0">
    <Button
      class="flex flex-col items-center p-4 h-48 w-40"
      :disabled="!league.isAvailable"
      @click="handleClick"
    >
      <div class="flex flex-col items-center justify-start gap-3 h-full">
        <img
          :src="`/images/leagues/${league.id}.svg`"
          class="relative w-12 h-12 transition-all duration-300"
          :class="{ 'opacity-50': !league.isAvailable }"
        />

        <div class="text-center">
          <h4
            class="font-semibold"
            :class="{
              'text-slate-900': league.isAvailable,
              'text-slate-500': !league.isAvailable,
            }"
          >
            {{ $t(league.name) }}
          </h4>

          <div class="text-xs mt-1 mb-4"> {{ $t('smilies') }}: {{ league.totalRowsLength }} </div>

          <div
            v-if="league.isCurrent && league.isAvailable && league.nextLevelPoints"
            class="text-xs mt-2 text-blue-600 font-medium"
          >
            {{ $t('nextLeagueRequirement', { points: league.nextLevelPoints }) }}
          </div>

          <div
            v-if="!league.isAvailable"
            class="text-xs mt-2 text-slate-500 text-center"
          >
            {{
              $t('unlockInstructions', { points: league.pointsToUnlock, league: $t(league.name) })
            }}
          </div>
        </div>
      </div>
    </Button>
  </div>
</template>
