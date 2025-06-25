<script setup lang="ts">
  import { ref, computed } from 'vue'
  import RankingItem from '@/components/app/RankingItem.vue'
  import Tabs from '@/components/shared/Tabs/index.vue'
  import { GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { LeagueRankingListRankItem, GameLeagueLevelKey } from '@/types/game'
  import { useI18n } from 'vue-i18n'
  import { isEmptyArray } from '@/utils'

  const props = defineProps<{
    list?: LeagueRankingListRankItem[]
  }>()

  const emit = defineEmits<{
    'tab-change': [index: number]
  }>()

  const { t } = useI18n()

  const activeTab = ref(0)

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
    emit('tab-change', index)
  }
</script>

<template>
  <div class="flex flex-col">
    <Tabs
      :items="tabItems"
      :active-tab="activeTab"
      tabs-container-classes="bg-white gap-0.5"
      tabs-content-classes="py-2 px-0 overflow-y-auto"
      @tab-change="handleTabChange"
      class="bg-slate-100 rounded-xl overflow-hidden"
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
        <ol class="flex flex-col">
          <li
            v-for="item in activeLeagueData"
            :key="item.position"
          >
            <RankingItem
              :position="item.position"
              :username="item.username"
              :score="item.score"
              :country="item.country"
            />
          </li>
        </ol>
      </template>
    </Tabs>
  </div>
</template>
