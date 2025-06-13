import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type { TileShape, TileExpression, TileRowItem } from '@/components/app/tile/types'
import { getRandomItem } from '@/composables/useTileGeneration'

interface GameTime {
  seconds: number
  minutes: number
}

export const useGameStore = defineStore('game', () => {
  const score = ref(0)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const isGameStarted = ref(false)
  const time = ref<GameTime>({
    seconds: 0,
    minutes: 0,
  })

  const character = computed<TileRowItem>(() => {
    const color = getRandomItem(Object.values(TILE_COLORS))

    return {
      type: 'character',
      shape: getRandomItem(Object.values(TILE_SHAPES) as TileShape[]),
      shapeColor: color.shapeColor,
      backgroundColor: color.backgroundColor,
      expression: getRandomItem(Object.values(TILE_EXPRESSIONS) as TileExpression[]),
    }
  })

  const formattedTime = computed(() => {
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(time.value.minutes)}:${pad(time.value.seconds)}`
  })

  let timeInterval: number | null = null

  function startTimeTracking() {
    if (timeInterval) return

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

  function updateCharacter() {
    character.value
  }

  function incrementScore(points: number = 1) {
    if (isPaused.value || !isGameStarted.value) return
    score.value += points
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

  function togglePause() {
    isPaused.value = !isPaused.value
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
    updateCharacter()
  }

  return {
    character,
    score,
    isGameOver,
    isPaused,
    isGameStarted,
    time,
    formattedTime,
    updateCharacter,
    incrementScore,
    resetScore,
    setGameOver,
    resetGame,
    pause,
    resume,
    startGame,
  }
})
