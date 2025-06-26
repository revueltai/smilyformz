import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  TILE_EXPRESSIONS,
  TILE_COLORS,
  TILE_SHAPES,
  GAME_LEAGUE_LEVELS,
  DEFAULT_LEAGUE_LEVEL,
} from '@/configs/constants'
import type { TileShape, TileExpression, TileSize } from '@/components/app/tile/types'
import type { GameLeagueLevelKey } from '@/types/game'
import { getRandomItem, canAdvanceToNextLeague } from '@/utils'
import { supabase } from '@/services/Supabase.service'
import { useUserStore } from './user.store'

interface GameTime {
  seconds: number
  minutes: number
}

/**
 * Handles the game state for the app.
 */
export const useGameStore = defineStore('game', () => {
  const userStore = useUserStore()

  const initialLeagueLevel = userStore.profile?.league_level || DEFAULT_LEAGUE_LEVEL
  const initialLeagueSettings = GAME_LEAGUE_LEVELS[initialLeagueLevel]

  // Speed milestones for increasing the game speed
  const SPEED_MILESTONES = [
    [15, 2.7],
    [30, 2.9],
    [60, 3.3],
    [180, 3.5],
    [360, 4],
    [720, 5],
    [1440, 6],
    [2880, 7],
  ]

  // Tile size map based on the league level
  const LEAGUE_TILE_SIZE_MAP: Record<GameLeagueLevelKey, TileSize> = {
    easy: 'xl',
    medium: 'lg',
    hard: 'md',
    legend: 'sm',
  }

  let timeInterval: number | null = null
  const pointsPerMatch = ref(1)
  const score = ref(0)
  const leagueLevel = ref(initialLeagueLevel)
  const totalRowsLength = ref(initialLeagueSettings.totalRowsLength)
  const initialRowSpacing = ref(initialLeagueSettings.initialRowSpacing)
  const gameSpeed = ref(initialLeagueSettings.initialSpeed)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const showSpeedIncreaseNotification = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })

  // Character state
  const character = ref({
    id: 'character',
    type: 'character',
    shape: getRandomItem(Object.values(TILE_SHAPES) as TileShape[]),
    shapeColor: getRandomItem(Object.values(TILE_COLORS)).shapeColor,
    backgroundColor: getRandomItem(Object.values(TILE_COLORS)).backgroundColor,
    expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
  })

  // Tile size based on the league level, the smaller the league level, the bigger the tile size
  const tileSize = computed(() => LEAGUE_TILE_SIZE_MAP[leagueLevel.value] as TileSize)

  // Formatted time for display
  const formattedTime = computed(() => {
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(time.value.minutes)}:${pad(time.value.seconds)}`
  })

  /**
   * Checks if the game speed should be increased based on the time elapsed
   */
  function checkAndIncreaseSpeed() {
    const totalSeconds = time.value.minutes * 60 + time.value.seconds

    for (const [milestoneSeconds, targetSpeed] of SPEED_MILESTONES) {
      if (totalSeconds === milestoneSeconds && gameSpeed.value < targetSpeed) {
        gameSpeed.value = targetSpeed
        showSpeedIncreaseNotification.value = true

        setTimeout(() => (showSpeedIncreaseNotification.value = false), 1500)

        break
      }
    }
  }

  /**
   * Starts tracking the time elapsed
   */
  function startTimeTracking() {
    if (timeInterval) {
      return
    }

    timeInterval = window.setInterval(() => {
      if (!isPaused.value && isGameStarted.value) {
        incrementTime()
      }
    }, 1000)
  }

  /**
   * Stops tracking the time elapsed
   */
  function stopTimeTracking() {
    if (timeInterval) {
      clearInterval(timeInterval)
      timeInterval = null
    }
  }

  /**
   * Increments the time elapsed
   */
  function incrementTime() {
    time.value.seconds++

    if (time.value.seconds >= 60) {
      time.value.seconds = 0
      time.value.minutes++
    }

    checkAndIncreaseSpeed()
  }

  /**
   * Resets the time elapsed
   */
  function resetTime() {
    time.value = {
      seconds: 0,
      minutes: 0,
    }
  }

  /**
   * Resets the game speed
   */
  function resetSpeed() {
    gameSpeed.value = initialLeagueSettings.initialSpeed
    showSpeedIncreaseNotification.value = false
  }

  /**
   * Increments the score based on the match
   *
   * @param shapeMatch - Whether the shape matched
   * @param colorMatch - Whether the color matched
   * @param doublePoints - Whether the double points are enabled
   */
  function incrementScore(shapeMatch: boolean, colorMatch: boolean, doublePoints: boolean = false) {
    if (isPaused.value || !isGameStarted.value || isGameOver.value) {
      return
    }

    let newPoints = 0

    if (doublePoints) {
      newPoints = pointsPerMatch.value * 4
    } else {
      if (shapeMatch || colorMatch) {
        newPoints += pointsPerMatch.value
      }

      if (shapeMatch && colorMatch) {
        newPoints += pointsPerMatch.value
      }
    }

    score.value += newPoints
  }

  function resetScore() {
    score.value = 0
  }

  function setGameOver(value: boolean) {
    isGameOver.value = value

    if (value) {
      stopTimeTracking()
    }
  }

  /**
   * Pauses the game
   */
  function pause() {
    isPaused.value = true
  }

  /**
   * Resumes the game
   */
  function resume() {
    isPaused.value = false
  }

  /**
   * Starts the game
   */
  function startGame() {
    isGameStarted.value = true
    startTimeTracking()
  }

  /**
   * Resets the game
   */
  function resetGame() {
    stopTimeTracking()
    resetScore()
    resetTime()
    resetSpeed()
    setGameOver(false)
    isPaused.value = false
    isGameStarted.value = false

    // Reset character to a new random state
    character.value = {
      id: 'character',
      type: 'character',
      shape: getRandomItem(Object.values(TILE_SHAPES) as TileShape[]),
      shapeColor: getRandomItem(Object.values(TILE_COLORS)).shapeColor,
      backgroundColor: getRandomItem(Object.values(TILE_COLORS)).backgroundColor,
      expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
    }
  }

  /**
   * Updates the character on a match
   *
   * @param characterProps - The properties to update the character with
   */
  function updateCharacterOnMatch(characterProps: {
    shape: TileShape
    shapeColor: string
    backgroundColor: string
  }) {
    character.value = {
      id: 'character',
      type: 'character',
      shape: characterProps.shape,
      shapeColor: characterProps.shapeColor,
      backgroundColor: characterProps.backgroundColor,
      expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
    }
  }

  /**
   * Saves the current game session to the database
   *
   * @param finalScore - The final score of the game
   * @param durationSeconds - The duration of the game in seconds
   */
  async function saveGameSession(finalScore: number, durationSeconds: number) {
    const userStore = useUserStore()

    if (!userStore.user) {
      throw new Error('No authenticated user found')
    }

    const payload = {
      user_id: userStore.user.id,
      score: finalScore.toString(),
      duration: durationSeconds.toString(),
    }

    return supabase.insertRecord('game_sessions', payload)
  }

  /**
   * Sets the league level for the current game session
   *
   * @param leagueLevelInput - The league level to set
   */
  function setLeagueLevel(leagueLevelInput: GameLeagueLevelKey) {
    const leagueSettings = GAME_LEAGUE_LEVELS[leagueLevelInput]

    leagueLevel.value = leagueLevelInput
    totalRowsLength.value = leagueSettings.totalRowsLength
    initialRowSpacing.value = leagueSettings.initialRowSpacing
    gameSpeed.value = leagueSettings.initialSpeed
  }

  /**
   * Checks if the user's score qualifies them for a new league level and updates it in the database
   *
   * @param finalScore - The final score of the game
   * @returns Promise<{ updated: boolean; newLeague?: GameLeagueLevelKey }> - Whether the league was updated and the new league if applicable
   */
  async function checkAndUpdateLeagueLevel(finalScore: number) {
    if (!userStore.user || !userStore.profile) {
      return { updated: false }
    }

    const currentLeague = userStore.profile.league_level
    const leagueKeys = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]

    if (canAdvanceToNextLeague(currentLeague, GAME_LEAGUE_LEVELS)) {
      const currentIndex = leagueKeys.indexOf(currentLeague)
      const nextLeagueKey = leagueKeys[currentIndex + 1]
      const currentLeagueSettings = GAME_LEAGUE_LEVELS[currentLeague]

      if (finalScore >= currentLeagueSettings.nextLevelPoints) {
        try {
          await userStore.updateUserSettings({
            league_level: nextLeagueKey,
          })

          return {
            updated: true,
            newLeague: nextLeagueKey,
          }
        } catch (error) {
          console.error('Error updating league level:', error)
          return { updated: false }
        }
      }
    }

    return { updated: false }
  }

  return {
    character,
    tileSize,
    pointsPerMatch,
    score,
    gameSpeed,
    isGameOver,
    isPaused,
    isGameStarted,
    showSpeedIncreaseNotification,
    time,
    formattedTime,
    totalRowsLength,
    initialRowSpacing,
    leagueLevel,
    incrementScore,
    resetScore,
    setGameOver,
    resetGame,
    pause,
    resume,
    startGame,
    updateCharacterOnMatch,
    resetSpeed,
    saveGameSession,
    setLeagueLevel,
    checkAndUpdateLeagueLevel,
  }
})
