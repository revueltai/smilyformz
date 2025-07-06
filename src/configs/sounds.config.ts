import type { MusicMap, SoundsMap } from '@/stores/sounds.store'

export const soundsConfig: SoundsMap = {
  buttonClick: {
    audio: new Audio('/sounds/uiButtonClick.wav'),
    volume: 0.1,
  },
  notificationSuccess: {
    audio: new Audio('/sounds/uiNotificationSuccess.mp3'),
    volume: 0.3,
  },
  notificationError: {
    audio: new Audio('/sounds/uiNotificationError.mp3'),
    volume: 0.3,
  },
  gameCountdownStart: {
    audio: new Audio('/sounds/gameCountdownStart.mp3'),
    volume: 0.2,
  },
  gameCountdownEnd: {
    audio: new Audio('/sounds/gameCountdownEnd.mp3'),
    volume: 0.2,
  },
  gameMotivationMessage: {
    audio: new Audio('/sounds/gameMotivationMessage.mp3'),
    volume: 0.2,
  },
  gameSpeedIncrease: {
    audio: new Audio('/sounds/gameSpeedIncrease.mp3'),
    volume: 0.2,
  },
  gameOver: {
    audio: new Audio('/sounds/gameOver.mp3'),
    volume: 0.2,
  },
  gameCharacterMove: {
    audio: new Audio('/sounds/gameCharacterMove.wav'),
    volume: 0.2,
  },
  gameTilePop: {
    audio: new Audio('/sounds/gameTilePop.mp3'),
    volume: 0.2,
  },
  gameTilePowerup: {
    audio: new Audio('/sounds/gameTilePowerup.mp3'),
    volume: 0.2,
  },
}

export const musicConfig: MusicMap = {
  appBgSound: {
    audio: new Audio('/sounds/uiAppBackground.mp3'),
    volume: 0.2,
  },
  gameBgSound: {
    audio: new Audio('/sounds/gameBackground.mp3'),
    volume: 0.2,
  },
}
