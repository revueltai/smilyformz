import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  TILE_EXPRESSIONS,
  TILE_COLORS,
  TILE_SHAPES,
  GAME_LEAGUE_LEVELS,
  DEFAULT_LEAGUE_LEVEL_NAME,
  GAME_SPEED_MILESTONES,
} from '@/configs/constants'
import type {
  CharacterItem,
  TileShape,
  TileExpression,
  TileSize,
} from '@/components/app/tile/types'
import type { GameLeagueLevelKey } from '@/types/game'
import { getRandomItem, canAdvanceToNextLeague } from '@/utils'
import { supabase } from '@/services/Supabase.service'
import { useUserStore } from './user.store'
import { useCollisionDetection } from '@/composables/useCollisionDetection'

interface GameTime {
  seconds: number
  minutes: number
}

/**
 * Handles the game state for the app.
 */
export const useGameStore = defineStore('game', () => {
  const userStore = useUserStore()
  const { resetCollisionDetection } = useCollisionDetection()

  const initialLeagueLevel = userStore.profile?.league_level || DEFAULT_LEAGUE_LEVEL_NAME
  const initialLeagueSettings = GAME_LEAGUE_LEVELS[initialLeagueLevel]

  // Tile size map based on the league level
  const LEAGUE_TILE_SIZE_MAP: Record<GameLeagueLevelKey, TileSize> = {
    easy: 'xl',
    medium: 'lg',
    hard: 'md',
    legend: 'sm',
  }

  let timeInterval: number | null = null
  const pointsPerMatch = ref(initialLeagueSettings.pointsPerMatch)
  const score = ref(0)
  const leagueLevel = ref(initialLeagueLevel)
  const totalRowsLength = ref(initialLeagueSettings.totalRowsLength)
  const initialRowSpacing = ref(initialLeagueSettings.initialRowSpacing)
  const gameSpeed = ref(initialLeagueSettings.initialSpeed)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const showSpeedIncreaseNotification = ref(false)
  const showConfetti = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })

  // Track which speed milestones have been reached to avoid duplicate increases
  const reachedSpeedMilestones = ref<Set<number>>(new Set())

  // Tile size based on the league level, the smaller the league level, the bigger the tile size
  const tileSize = computed(() => LEAGUE_TILE_SIZE_MAP[leagueLevel.value] as TileSize)

  const character = ref(createCharacter())

  const formattedTime = computed(() => {
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(time.value.minutes)}:${pad(time.value.seconds)}`
  })

  /**
   * Creates a character object with a random color and shape.
   *
   * @returns The character object.
   */
  function createCharacter(): CharacterItem {
    const color = getRandomItem(Object.values(TILE_COLORS))

    return {
      id: 'character',
      type: 'character',
      size: tileSize.value,
      shape: getRandomItem(Object.values(TILE_SHAPES) as TileShape[]),
      shapeColor: color.shapeColor,
      backgroundColor: color.backgroundColor,
      expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
    }
  }

  /**
   * Checks if the game speed should be increased based on the time elapsed
   */
  function checkAndIncreaseSpeed() {
    const totalSeconds = time.value.minutes * 60 + time.value.seconds
    const currentLeagueSettings = GAME_LEAGUE_LEVELS[leagueLevel.value]

    for (const milestoneSeconds of GAME_SPEED_MILESTONES) {
      if (
        totalSeconds === milestoneSeconds &&
        !reachedSpeedMilestones.value.has(milestoneSeconds)
      ) {
        reachedSpeedMilestones.value.add(milestoneSeconds)

        gameSpeed.value += currentLeagueSettings.speedIncrement

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
    const currentLeagueSettings = GAME_LEAGUE_LEVELS[leagueLevel.value]
    gameSpeed.value = currentLeagueSettings.initialSpeed
    showSpeedIncreaseNotification.value = false
    reachedSpeedMilestones.value.clear()
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

    if (doublePoints || (shapeMatch && colorMatch)) {
      score.value += pointsPerMatch.value * 2
      return
    }

    if (shapeMatch || colorMatch) {
      score.value += pointsPerMatch.value
    }
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
    showConfetti.value = false

    // Reset collision detection
    resetCollisionDetection()

    // Reset character to a new random state
    character.value = createCharacter()
  }

  /**
   * Restarts the game (resets and prepares for new start)
   */
  function restartGame() {
    resetGame()
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
      size: tileSize.value,
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
   * @param leagueLevelInput - The league level to set (Default: DEFAULT_LEAGUE_LEVEL_NAME)
   */
  function setLeagueLevel(leagueLevelInput: GameLeagueLevelKey = DEFAULT_LEAGUE_LEVEL_NAME) {
    const leagueSettings = GAME_LEAGUE_LEVELS[leagueLevelInput]

    leagueLevel.value = leagueLevelInput
    totalRowsLength.value = leagueSettings.totalRowsLength
    initialRowSpacing.value = leagueSettings.initialRowSpacing
    gameSpeed.value = leagueSettings.initialSpeed
    pointsPerMatch.value = leagueSettings.pointsPerMatch
    reachedSpeedMilestones.value.clear()
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

    const currentLeague = userStore.leagueLevelKey
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
    showConfetti,
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
    restartGame,
  }
})
