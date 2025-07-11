import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/Supabase.service'
import { GAME_LEAGUE_LEVELS, LEAGUE_RANKING_LIST_LIMIT } from '@/configs/constants'
import type { GameLeagueLevelKey, LeagueRankingListRankItem } from '@/types/game'

type ErrorRecord = Record<GameLeagueLevelKey, string | null>
type LoadingRecord = Record<GameLeagueLevelKey, boolean>
type RankingsRecord = Record<GameLeagueLevelKey, LeagueRankingListRankItem[]>

const POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

const VISIBILITY_POLLING_INTERVAL = 30 * 1000 // 30 seconds when tab is not visible

/**
 * Handles the leagues ranking data for the app.
 */
export const useRankingStore = defineStore('leagueRanking', () => {
  const rankings = ref<RankingsRecord>({} as RankingsRecord)
  const loading = ref<LoadingRecord>({} as LoadingRecord)
  const errors = ref<ErrorRecord>({} as ErrorRecord)

  const isPollingActive = ref(false)
  const pollingInterval = ref<number | null>(null)
  const loadedLeagues = ref<Set<GameLeagueLevelKey>>(new Set())
  const lastFetchTime = ref<Record<GameLeagueLevelKey, number>>(
    {} as Record<GameLeagueLevelKey, number>,
  )

  const isLoading = computed(() => (league: GameLeagueLevelKey) => loading.value[league] || false)
  const hasError = computed(() => (league: GameLeagueLevelKey) => errors.value[league] || null)
  const getRankings = computed(() => (league: GameLeagueLevelKey) => rankings.value[league] || [])
  const availableLeagues = computed(() => Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[])

  /**
   * Checks if the tab is currently visible
   */
  function isTabVisible(): boolean {
    return !document.hidden
  }

  /**
   * Gets the appropriate polling interval based on tab visibility
   */
  function getPollingInterval(): number {
    return isTabVisible() ? POLLING_INTERVAL : VISIBILITY_POLLING_INTERVAL
  }

  /**
   * Checks if it's time to refresh rankings for a specific league
   */
  function shouldRefreshRankings(leagueLevel: GameLeagueLevelKey): boolean {
    const lastFetch = lastFetchTime.value[leagueLevel] || 0
    const now = Date.now()
    const interval = getPollingInterval()

    return now - lastFetch >= interval
  }

  /**
   * Performs a single polling cycle to refresh rankings
   */
  async function poll() {
    if (!isPollingActive.value) {
      return
    }

    const leaguesToRefresh = availableLeagues.value.filter(
      (league) => loadedLeagues.value.has(league) && shouldRefreshRankings(league),
    )

    for (const league of leaguesToRefresh) {
      try {
        await fetchRankings(league, true)
      } catch (error) {
        console.error(`Failed to refresh rankings for ${league}:`, error)
      }
    }

    if (isPollingActive.value) {
      pollingInterval.value = window.setTimeout(poll, getPollingInterval())
    }
  }

  /**
   * Starts the polling mechanism for automatic ranking updates
   */
  function startPolling() {
    if (isPollingActive.value) {
      return
    }

    isPollingActive.value = true

    // Start the first poll
    poll()
  }

  /**
   * Stops the polling mechanism
   */
  function stopPolling() {
    isPollingActive.value = false

    if (pollingInterval.value) {
      clearTimeout(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  /**
   * Handles visibility change to adjust polling behavior
   */
  function handleVisibilityChange() {
    if (isPollingActive.value) {
      // Restart polling with new interval
      stopPolling()
      startPolling()
    }
  }

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
      lastFetchTime.value[leagueLevel] = Date.now()

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

  /**
   * Initializes the ranking store with polling
   */
  function initializeRankingStore() {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    startPolling()
  }

  /**
   * Cleans up the ranking store
   */
  function cleanupRankingStore() {
    stopPolling()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  return {
    rankings,
    loading,
    errors,
    loadedLeagues,
    isPollingActive,

    isLoading,
    hasError,
    getRankings,
    availableLeagues,

    fetchRankings,
    refreshRankings,
    initializeRankingStore,
    cleanupRankingStore,
  }
})
