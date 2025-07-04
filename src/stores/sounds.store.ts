import { defineStore } from 'pinia'
import { musicConfig, soundsConfig } from '@/configs/sounds.config'
import { reactive, toRefs } from 'vue'

interface Sound {
  audio: HTMLAudioElement
  volume: number
}

export interface MusicMap {
  appBgSound: Sound
  gameBgSound: Sound
}

export interface SoundsMap {
  buttonClick: Sound
  notificationSuccess: Sound
  notificationError: Sound
  gameOver: Sound
  gameCharacterMove: Sound
  gameTilePop: Sound
  gameTilePowerup: Sound
}

type MusicName = keyof MusicMap

type SoundName = keyof SoundsMap

interface SoundState {
  initialized: boolean
  musicOn: boolean
  soundOn: boolean
  soundActive: MusicName | ''
  soundEffectActive: SoundName | ''
  music: MusicMap
  sounds: SoundsMap
}

/**
 * This store is used to manage the sounds of the game.
 * It is used to play the sounds and sound effects of the game.
 */
export const useSoundStore = defineStore('sound', () => {
  const state = reactive<SoundState>({
    initialized: false,
    musicOn: false,
    soundOn: false,
    soundActive: '',
    soundEffectActive: '',
    sounds: soundsConfig,
    music: musicConfig,
  })

  /**
   * Plays an audio element (music or sound).
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
  function playSound(key: SoundName) {
    if (!state.soundOn) {
      return
    }

    const audio = state.sounds[key].audio
    if (audio) {
      state.soundEffectActive = key as SoundName
      audio.volume = state.sounds[key].volume
      audio.currentTime = 0
      playAudio(audio)
    }
  }

  /**
   * Plays a music loop.
   *
   * @param key - The key of the sound to play.
   */
  function playLoopMusic(key: MusicName | '') {
    if (!key) {
      return
    }

    if (!state.musicOn) {
      stopLoopMusic()
      return
    }

    const audio = state.music[key].audio
    if (audio) {
      state.soundActive = key as MusicName
      audio.volume = state.music[key].volume
      audio.loop = true
      playAudio(audio)
    }
  }

  /**
   * Stops a music loop.
   */
  function stopLoopMusic() {
    if (state.soundActive) {
      const audio = state.music[state.soundActive as MusicName].audio

      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }

  /**
   * Stops a sound effect.
   */
  function stopSound() {
    if (state.soundEffectActive) {
      const audio = state.sounds[state.soundEffectActive as SoundName].audio

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
    state.musicOn = value
  }

  /**
   * Updates the sound effects setting.
   *
   * @param value - The value of the sound effects setting.
   */
  function updateSoundEffectsSetting(value: boolean) {
    state.soundOn = value
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
    playSound,
    playLoopMusic,
    stopLoopMusic,
    stopSound,
    updateSoundSetting,
    updateSoundEffectsSetting,
    initializeSounds,
  }
})
