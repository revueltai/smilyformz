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
  const pointsPerMatch = ref(1)
  const score = ref(0)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })
  let timeInterval: number | null = null

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
  }

  function resetTime() {
    time.value = {
      seconds: 0,
      minutes: 0,
    }
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
    isGameOver,
    isPaused,
    isGameStarted,
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
  }
})
