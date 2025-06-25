import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/Supabase.service'
import { GAME_LEAGUE_LEVELS, LEAGUE_RANKING_LIST_LIMIT } from '@/configs/constants'
import type { GameLeagueLevelKey, LeagueRankingListRankItem } from '@/types/game'

type ErrorRecord = Record<GameLeagueLevelKey, string | null>
type LoadingRecord = Record<GameLeagueLevelKey, boolean>
type RankingsRecord = Record<GameLeagueLevelKey, LeagueRankingListRankItem[]>

/**
 * Handles the leagues ranking data for the app.
 */
export const useRankingStore = defineStore('leagueRanking', () => {
  const rankings = ref<RankingsRecord>({} as RankingsRecord)
  const loading = ref<LoadingRecord>({} as LoadingRecord)
  const errors = ref<ErrorRecord>({} as ErrorRecord)

  const loadedLeagues = ref<Set<GameLeagueLevelKey>>(new Set())

  const isLoading = computed(() => (league: GameLeagueLevelKey) => loading.value[league] || false)
  const hasError = computed(() => (league: GameLeagueLevelKey) => errors.value[league] || null)
  const getRankings = computed(() => (league: GameLeagueLevelKey) => rankings.value[league] || [])
  const availableLeagues = computed(() => Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[])

  /**
   * Fetches the rankings for a given league level.
   *
   * @param leagueLevel - The league level to fetch rankings for.
   * @param forceRefresh - Whether to force a refresh of the rankings.
   * @returns The rankings for the given league level.
   */
  async function fetchRankings(leagueLevel: GameLeagueLevelKey, forceRefresh: boolean = false) {
    if (!forceRefresh && loadedLeagues.value.has(leagueLevel) && rankings.value[leagueLevel]) {
      return rankings.value[leagueLevel]
    }

    loading.value[leagueLevel] = true
    errors.value[leagueLevel] = null

    try {
      const data = await supabase.getLeagueRankings(leagueLevel, LEAGUE_RANKING_LIST_LIMIT)

      const processedData = data.map((item) => ({
        ...item,
        league: item.league as GameLeagueLevelKey,
      }))

      rankings.value[leagueLevel] = processedData
      loadedLeagues.value.add(leagueLevel)

      return processedData
    } catch (err) {
      console.error('Failed to fetch rankings:', err)
      const errorMessage = 'failedToLoadRankings'

      errors.value[leagueLevel] = errorMessage
      rankings.value[leagueLevel] = []

      throw new Error(errorMessage)
    } finally {
      loading.value[leagueLevel] = false
    }
  }

  /**
   * Refreshes the rankings for a given league level.
   *
   * @param leagueLevel - The league level to refresh the rankings for.
   * @returns The refreshed rankings for the given league level.
   */
  function refreshRankings(leagueLevel: GameLeagueLevelKey) {
    return fetchRankings(leagueLevel, true)
  }

  return {
    rankings,
    loading,
    errors,
    loadedLeagues,

    isLoading,
    hasError,
    getRankings,
    availableLeagues,

    fetchRankings,
    refreshRankings,
  }
})
