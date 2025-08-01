import { defineStore } from 'pinia'
import { musicConfig, soundsConfig } from '@/configs/sounds.config'
import { reactive, toRefs, watch } from 'vue'
import { useUserStore } from '@/stores/user.store'

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
  gameCountdownStart: Sound
  gameCountdownEnd: Sound
  gameOver: Sound
  gameMotivationMessage: Sound
  gameSpeedIncrease: Sound
  gameCharacterMove: Sound
  gameTilePop: Sound
  gameTilePowerup: Sound
  gameConfetti: Sound
  gameTileRowExplosion: Sound
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
  const userStore = useUserStore()

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
   * Catches errors and logs them, if they are not the "autoplay policy".
   *
   * @param audio - The audio element to play.
   */
  function playAudio(audio: HTMLAudioElement) {
    if (document.hasFocus()) {
      audio.play().catch((err: any) => {
        if (err.name !== 'NotAllowedError') {
          console.error('Audio Play failed:', err)
        }
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
   * @param key - The key of the music to play.
   */
  function playLoopMusic(key: MusicName | '') {
    if (!key) {
      return
    }

    if (state.soundActive === key && state.musicOn) {
      const audio = state.music[key].audio

      // Try-restart the audio if it is paused (due to autoplay policy).
      if (audio && audio.paused) {
        audio.volume = state.music[key].volume
        audio.loop = true
        playAudio(audio)
      }
      return
    }

    // Stop current music only if we're changing to a different track
    if (state.soundActive && state.soundActive !== key) {
      stopLoopMusic()
    }

    if (!state.musicOn) {
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
   * @param newValue - The value of the sound setting.
   */
  function updateSoundSetting(newValue: boolean) {
    const wasMusicOn = state.musicOn
    state.musicOn = newValue

    // If music is off, stop the currently playing music
    if (!newValue) {
      stopLoopMusic()
      return
    }

    if (!wasMusicOn && newValue && state.soundActive) {
      // If music is on and it wasn't on before, restart the music
      // that was previously playing
      const audio = state.music[state.soundActive as MusicName].audio

      if (audio) {
        audio.volume = state.music[state.soundActive as MusicName].volume
        audio.loop = true
        playAudio(audio)
      }
    }
  }

  /**
   * Updates the sound effects setting.
   *
   * @param value - The value of the sound effects setting.
   */
  function updateSoundEffectsSetting(newValue: boolean) {
    state.soundOn = newValue

    if (!newValue) {
      stopSound()
    }
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

  watch(
    () => userStore.music,
    (newValue) => {
      if (state.initialized) {
        updateSoundSetting(newValue)
      }
    },
  )

  watch(
    () => userStore.sound,
    (newValue) => {
      if (state.initialized) {
        updateSoundEffectsSetting(newValue)
      }
    },
  )

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
