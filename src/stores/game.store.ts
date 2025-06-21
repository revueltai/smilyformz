import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type { TileShape, TileExpression } from '@/components/app/tile/types'
import { getRandomItem } from '@/utils'
import { supabase } from '@/services/Supabase.service'
import { useUserStore } from './user.store'

interface GameTime {
  seconds: number
  minutes: number
}

const GAME_INITIAL_SPEED = 2.5
const GAME_INITIAL_ROW_SPACING = 400

export const useGameStore = defineStore('game', () => {
  let timeInterval: number | null = null
  const pointsPerMatch = ref(1)
  const score = ref(0)
  const initialRowSpacing = ref(GAME_INITIAL_ROW_SPACING)
  const gameSpeed = ref(GAME_INITIAL_SPEED)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const showSpeedIncreaseNotification = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })

  const speedMilestones = [
    [15, 2.7],
    [30, 2.9],
    [60, 3.3],
    [180, 3.5],
    [360, 4],
    [720, 5],
    [1440, 6],
    [2880, 7],
  ]

  const character = ref({
    id: 'character',
    type: 'character',
    shape: getRandomItem(Object.values(TILE_SHAPES) as TileShape[]),
    shapeColor: getRandomItem(Object.values(TILE_COLORS)).shapeColor,
    backgroundColor: getRandomItem(Object.values(TILE_COLORS)).backgroundColor,
    expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
  })

  const formattedTime = computed(() => {
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(time.value.minutes)}:${pad(time.value.seconds)}`
  })

  function checkAndIncreaseSpeed() {
    const totalSeconds = time.value.minutes * 60 + time.value.seconds

    for (const [milestoneSeconds, targetSpeed] of speedMilestones) {
      if (totalSeconds === milestoneSeconds && gameSpeed.value < targetSpeed) {
        gameSpeed.value = targetSpeed
        showSpeedIncreaseNotification.value = true

        setTimeout(() => (showSpeedIncreaseNotification.value = false), 1500)

        break
      }
    }
  }

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

  function stopTimeTracking() {
    if (timeInterval) {
      clearInterval(timeInterval)
      timeInterval = null
    }
  }

  function incrementTime() {
    time.value.seconds++

    if (time.value.seconds >= 60) {
      time.value.seconds = 0
      time.value.minutes++
    }

    checkAndIncreaseSpeed()
  }

  function resetTime() {
    time.value = {
      seconds: 0,
      minutes: 0,
    }
  }

  function resetSpeed() {
    gameSpeed.value = GAME_INITIAL_SPEED
    showSpeedIncreaseNotification.value = false
  }

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

  function pause() {
    isPaused.value = true
  }

  function resume() {
    isPaused.value = false
  }

  function startGame() {
    isGameStarted.value = true
    startTimeTracking()
  }

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

  return {
    character,
    pointsPerMatch,
    score,
    gameSpeed,
    isGameOver,
    isPaused,
    isGameStarted,
    showSpeedIncreaseNotification,
    time,
    formattedTime,
    initialRowSpacing,
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
  }
})
