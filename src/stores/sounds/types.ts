export interface Sound {
  audio: HTMLAudioElement
  volume: number
}

export interface SoundsMap {
  firstSessionBg: Sound
  dashboardBg: Sound
  gameBg: Sound
}

export interface SoundsEffectsMap {
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

export type SoundName = keyof SoundsMap

export type SoundEffectName = keyof SoundsEffectsMap
