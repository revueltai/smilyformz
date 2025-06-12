export type OverlayState = 'fadeIn' | 'fadeOut' | 'visible' | 'hidden'

export const AVATAR_DEFAULTS = {
  shape: 'circle',
  expression: 'exp1',
  shapeColor: '#00BCFF',
  backgroundColor: '#CCF2FF',
}

export const MODALS = {
  LOGIN: 'login',
  CREATE_ACCOUNT: 'createAccount',
  TUTORIAL: 'tutorial',
  AVATAR: 'avatar',
  PAUSE: 'pause',
  SHARE: 'share',
}

export const AVATAR_EXPRESSIONS = {
  EXP1: 'exp1',
  EXP2: 'exp2',
  EXP3: 'exp3',
  EXP4: 'exp4',
  EXP5: 'exp5',
}

export const AVATAR_SHAPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  TRIANGLE: 'triangle',
  RHOMB: 'rhomb',
  STAR: 'star',
}

export const UI: {
  animationClasses: {
    named: Record<string, string>
    timed: Record<string, string>
  }
  modalStates: Record<OverlayState, OverlayState>
} = {
  animationClasses: {
    named: {
      scaleIn: 'anim-scale-in-named',
      scaleOut: 'anim-scale-out-named',
      fadeIn: 'anim-fade-in-named',
      fadeOut: 'anim-fade-out-named',
      slideInTop: 'anim-slide-in-top-named',
      slideInBottom: 'anim-slide-in-bottom-named',
      beat: 'anim-beat-named',
      highlight: 'anim-highlight-named',
    },
    timed: {
      scaleIn: 'anim-scale-in-timed',
      scaleOut: 'anim-scale-out-timed',
      fadeIn: 'anim-fade-in-timed',
      fadeOut: 'anim-fade-out-timed',
      slideInTop: 'anim-slide-in-top-timed',
      slideInOutTop: 'anim-slide-in-out-top-timed',
      slideInBottom: 'anim-slide-in-bottom-timed',
      beat: 'anim-beat-timed',
      highlight: 'anim-highlight-timed',
    },
  },
  modalStates: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    visible: 'visible',
    hidden: 'hidden',
  },
}
