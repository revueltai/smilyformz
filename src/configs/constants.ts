import type {
  TileColor,
  TileShape,
  TileExpression,
  TileExpressionPowerDown,
  TilePowerUpType,
} from '@/components/app/tile/types'

export type OverlayState = 'fadeIn' | 'fadeOut' | 'visible' | 'hidden'

export const MODALS = {
  LOGIN: 'login',
  CREATE_ACCOUNT: 'createAccount',
  TUTORIAL: 'tutorial',
  AVATAR: 'avatar',
  PAUSE: 'pause',
  SHARE: 'share',
  QUIT_CONFIRM: 'quitConfirm',
  GAME_OVER: 'gameOver',
}

export const TILE_COLORS: Record<string, TileColor> = {
  COLOR1: { shapeColor: '#00BCFF', backgroundColor: '#CCF2FF' },
  COLOR2: { shapeColor: '#00A63E', backgroundColor: '#DCFCE7' },
  COLOR3: { shapeColor: '#C800DE', backgroundColor: '#FAE8FF' },
  COLOR4: { shapeColor: '#EFB100', backgroundColor: '#FEF9C2' },
  COLOR5: { shapeColor: '#0092B8', backgroundColor: '#CEFAFE' },
  COLOR6: { shapeColor: '#EC003F', backgroundColor: '#FEE4E2' },
}

export const TILE_EXPRESSIONS: Record<string, TileExpression> = {
  EXP1: 'exp1',
  EXP2: 'exp2',
  EXP3: 'exp3',
  EXP4: 'exp4',
}

export const TILE_POWER_UP_TYPES: Record<string, TilePowerUpType> = {
  NONE: 'none',
  DOUBLE_POINTS: 'doublePoints',
  ANY_SHAPE: 'anyShape',
  ANY_COLOR: 'anyColor',
}

export const TILE_SHAPES: Record<string, TileShape> = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  TRIANGLE: 'triangle',
  RHOMB: 'rhomb',
  STAR: 'star',
}

export const TILE_DEFAULTS = {
  shape: TILE_SHAPES.CIRCLE,
  expression: TILE_EXPRESSIONS.EXP1,
  shapeColor: TILE_COLORS.COLOR1.shapeColor,
  backgroundColor: TILE_COLORS.COLOR1.backgroundColor,
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
