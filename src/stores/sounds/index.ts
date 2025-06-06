import { defineStore } from 'pinia'
import { soundsConfig, soundsEffectsConfig } from '@/configs/sounds.config'
import type { SoundEffectName, SoundName, SoundsEffectsMap, SoundsMap } from './types'

interface SoundState {
  initialized: boolean
  soundsOn: boolean
  soundEffectsOn: boolean
  soundActive: SoundName | ''
  soundEffectActive: SoundEffectName | ''
  sounds: SoundsMap
  soundsEffects: SoundsEffectsMap
}

export const useSoundStore = defineStore('sound', {
  state: (): SoundState => ({
    initialized: false,
    soundsOn: false,
    soundEffectsOn: false,
    soundActive: '',
    soundEffectActive: '',
    soundsEffects: soundsEffectsConfig,
    sounds: soundsConfig,
  }),

  actions: {
    playAudio(audio: HTMLAudioElement) {
      if (document.hasFocus()) {
        audio.play().catch((err: any) => {
          console.error('Audio Play failed:', err)
        })
      }
    },

    playSoundEffect(key: SoundEffectName) {
      if (!this.soundEffectsOn) {
        return
      }

      const audio = this.soundsEffects[key].audio
      if (audio) {
        this.soundEffectActive = key as SoundEffectName
        audio.volume = this.soundsEffects[key].volume
        audio.currentTime = 0
        this.playAudio(audio)
      }
    },

    playLoopSound(key: SoundName | '') {
      if (!key) {
        return
      }

      if (!this.soundsOn) {
        this.stopLoopSound()
        return
      }

      const audio = this.sounds[key].audio
      if (audio) {
        this.soundActive = key as SoundName
        audio.volume = this.sounds[key].volume
        audio.loop = true
        this.playAudio(audio)
      }
    },

    stopLoopSound() {
      if (this.soundActive) {
        const audio = this.sounds[this.soundActive as SoundName].audio

        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    },

    stopSoundEffect() {
      if (this.soundEffectActive) {
        const audio = this.soundsEffects[this.soundEffectActive as SoundEffectName].audio

        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    },

    async updateSoundSetting(value: boolean) {
      this.soundsOn = value
    },

    async updateSoundEffectsSetting(value: boolean) {
      this.soundEffectsOn = value
    },

    async initializeSounds(hasSound: boolean, hasEffects: boolean) {
      if (!this.initialized) {
        await this.updateSoundSetting(hasSound)
        await this.updateSoundEffectsSetting(hasEffects)

        this.initialized = true
      }
    },
  },
})
