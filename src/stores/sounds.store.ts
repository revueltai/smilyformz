import { defineStore } from 'pinia'
import { soundsConfig, soundsEffectsConfig } from '@/configs/sounds.config'
import { reactive, toRefs } from 'vue'

interface Sound {
  audio: HTMLAudioElement
  volume: number
}

interface SoundsMap {
  firstSessionBg: Sound
  dashboardBg: Sound
  gameBg: Sound
}

interface SoundsEffectsMap {
  buttonClick: Sound
  notificationSuccess: Sound
  notificationError: Sound
  gameTick: Sound
  gameTilePop: Sound
  gameTilePowerup: Sound
  gameRoundOver: Sound
  gameRoundLost: Sound
  gameWon: Sound
  gameLost: Sound
}

type SoundName = keyof SoundsMap

type SoundEffectName = keyof SoundsEffectsMap

interface SoundState {
  initialized: boolean
  soundsOn: boolean
  soundEffectsOn: boolean
  soundActive: SoundName | ''
  soundEffectActive: SoundEffectName | ''
  sounds: SoundsMap
  soundsEffects: SoundsEffectsMap
}

/**
 * This store is used to manage the sounds of the game.
 * It is used to play the sounds and sound effects of the game.
 */
export const useSoundStore = defineStore('sound', () => {
  const state = reactive<SoundState>({
    initialized: false,
    soundsOn: false,
    soundEffectsOn: false,
    soundActive: '',
    soundEffectActive: '',
    soundsEffects: soundsEffectsConfig,
    sounds: soundsConfig,
  })

  /**
   * Plays an audio element.
   *
   * @param audio - The audio element to play.
   */
  function playAudio(audio: HTMLAudioElement) {
    if (document.hasFocus()) {
      audio.play().catch((err: any) => {
        console.error('Audio Play failed:', err)
      })
    }
  }

  /**
   * Plays a sound effect.
   *
   * @param key - The key of the sound effect to play.
   */
  function playSoundEffect(key: SoundEffectName) {
    if (!state.soundEffectsOn) {
      return
    }

    const audio = state.soundsEffects[key].audio
    if (audio) {
      state.soundEffectActive = key as SoundEffectName
      audio.volume = state.soundsEffects[key].volume
      audio.currentTime = 0
      playAudio(audio)
    }
  }

  /**
   * Plays a sound in a loop.
   *
   * @param key - The key of the sound to play.
   */
  function playLoopSound(key: SoundName | '') {
    if (!key) {
      return
    }

    if (!state.soundsOn) {
      stopLoopSound()
      return
    }

    const audio = state.sounds[key].audio
    if (audio) {
      state.soundActive = key as SoundName
      audio.volume = state.sounds[key].volume
      audio.loop = true
      playAudio(audio)
    }
  }

  /**
   * Stops a sound loop.
   */
  function stopLoopSound() {
    if (state.soundActive) {
      const audio = state.sounds[state.soundActive as SoundName].audio

      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  /**
   * Stops a sound effect.
   */
  function stopSoundEffect() {
    if (state.soundEffectActive) {
      const audio = state.soundsEffects[state.soundEffectActive as SoundEffectName].audio

      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  /**
   * Updates the sound setting.
   *
   * @param value - The value of the sound setting.
   */
  function updateSoundSetting(value: boolean) {
    state.soundsOn = value
  }

  /**
   * Updates the sound effects setting.
   *
   * @param value - The value of the sound effects setting.
   */
  function updateSoundEffectsSetting(value: boolean) {
    state.soundEffectsOn = value
  }

  /**
   * Initializes the sounds.
   *
   * @param hasSound - The value of the sound setting.
   * @param hasEffects - The value of the sound effects setting.
   */
  function initializeSounds(hasSound: boolean, hasEffects: boolean) {
    if (!state.initialized) {
      updateSoundSetting(hasSound)
      updateSoundEffectsSetting(hasEffects)

      state.initialized = true
    }
  }

  return {
    ...toRefs(state),

    playAudio,
    playSoundEffect,
    playLoopSound,
    stopLoopSound,
    stopSoundEffect,
    updateSoundSetting,
    updateSoundEffectsSetting,
    initializeSounds,
  }
})
