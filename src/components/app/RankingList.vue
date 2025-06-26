<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import RankingItem from '@/components/app/RankingItem.vue'
  import Tabs from '@/components/shared/Tabs/index.vue'
  import Loader from '@/components/shared/Loader/index.vue'
  import Button from '@/components/shared/Button/index.vue'
  import { GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { LeagueRankingListRankItem, GameLeagueLevelKey } from '@/types/game'
  import { useI18n } from 'vue-i18n'
  import { isEmptyArray } from '@/utils'

  const props = defineProps<{
    list?: LeagueRankingListRankItem[]
    loading?: boolean
    error?: string | null
  }>()

  const emit = defineEmits<{
    change: [index: number]
    retry: []
  }>()

  const { t } = useI18n()

  const activeTab = ref(0)
  const tabChangeAnimationKey = ref(0)

  const tabItems = computed(() => {
    return Object.keys(GAME_LEAGUE_LEVELS).map((leagueKey) => ({
      id: leagueKey,
      label: t(`leagueName_${leagueKey}`),
      value: leagueKey,
    }))
  })

  const activeLeagueData = computed(() => {
    if (!props.list || isEmptyArray(props.list)) {
      return []
    }

    const leagueKeys = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]
    const activeLeague = leagueKeys[activeTab.value]

    return props.list.filter((item) => item.league === activeLeague)
  })

  function handleTabChange(index: number) {
    activeTab.value = index
    tabChangeAnimationKey.value++

    emit('change', index)
  }

  function handleRetry() {
    emit('retry')
  }
</script>

<template>
  <div class="flex flex-col h-full">
    <Tabs
      :items="tabItems"
      :active-tab="activeTab"
      tabs-container-classes="bg-white gap-0.5 shrink-0"
      tabs-content-classes="flex-1 min-h-0 h-full"
      class="bg-slate-100 rounded-xl overflow-hidden h-full flex flex-col"
      @tab-change="handleTabChange"
    >
      <template #tabs="{ items, activeTab, handleTabClick }">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="[
            'text-sm py-3 px-4 font-medium transition-colors duration-300 ease-in-out cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-2 rounded-t-xl text-slate-600 bg-slate-100',
            { 'opacity-50': index !== activeTab },
          ]"
          @click="handleTabClick(index)"
        >
          <img
            :src="`/images/leagues/${item.value}.svg`"
            :alt="item.label"
            class="w-5 h-5 object-contain"
          />

          <span>{{ item.label }}</span>
        </div>
      </template>

      <template #default>
        <div class="h-full overflow-y-auto p-2">
          <Loader
            v-if="loading"
            size="lg"
            class="flex items-center justify-center py-8"
          />

          <div
            v-else-if="error"
            class="flex flex-col items-center justify-center py-8 gap-4"
          >
            <p class="text-red-500 text-center">{{ $t(error) }}</p>

            <Button
              size="sm"
              @click="handleRetry"
            >
              {{ $t('retry') }}
            </Button>
          </div>

          <ol
            v-else
            class="flex flex-col"
          >
            <li
              v-for="(item, index) in activeLeagueData"
              :key="`${tabChangeAnimationKey}-${index}`"
              class="ranking-item"
              :style="{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }"
            >
              <RankingItem
                :position="index + 1"
                :username="item.username"
                :score="item.score"
                :country="item.country"
              />
            </li>
          </ol>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<style scoped>
  .ranking-item {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInUp 0.4s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
