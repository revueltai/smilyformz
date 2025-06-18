import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type { TileShape, TileExpression } from '@/components/app/tile/types'
import { getRandomItem } from '@/utils'

interface GameTime {
  seconds: number
  minutes: number
}

export const useGameStore = defineStore('game', () => {
  let timeInterval: number | null = null
  const pointsPerMatch = ref(1)
  const score = ref(0)
  const gameSpeed = ref(1)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const showSpeedIncreaseNotification = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })

  const speedMilestones = [
    [10, 2],
    [30, 2.5],
    [60, 3],
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

        const minutes = Math.floor(milestoneSeconds / 60)
        const seconds = milestoneSeconds % 60
        const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
        console.log(`Speed increased to ${targetSpeed} at ${timeDisplay}`)

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
    gameSpeed.value = 1
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
    incrementScore,
    resetScore,
    setGameOver,
    resetGame,
    pause,
    resume,
    startGame,
    updateCharacterOnMatch,
    resetSpeed,
  }
})
