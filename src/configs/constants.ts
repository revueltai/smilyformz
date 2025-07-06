import type {
  TileColor,
  TileShape,
  TileExpression,
  TilePowerUpType,
} from '@/components/app/tile/types'
import type { GameLeagueLevel, GameLeagueLevelKey } from '@/types/game'

export const APP_SHARE_URL = 'https://smilyformz.vercel.app/'

export const GAME_ROWS_COUNT = 5

export const MODALS = {
  CREDITS: 'credits',
  LOGIN: 'login',
  CREATE_ACCOUNT: 'createAccount',
  TUTORIAL: 'tutorial',
  AVATAR: 'avatar',
  USERNAME: 'username',
  PAUSE: 'pause',
  SHARE: 'share',
  QUIT_CONFIRM: 'quitConfirm',
  GAME_OVER: 'gameOver',
  GAME_OVER_GUEST: 'gameOverGuest',
  DELETE_ACCOUNT_CONFIRM: 'deleteAccountConfirm',
  RELOGIN_CONFIRM: 'reloginConfirm',
  LEAGUE_SELECTION: 'leagueSelection',
  OFFLINE: 'offline',
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

export const DEFAULT_LEAGUE_LEVEL_NAME = 'easy'

export const LEAGUE_RANKING_LIST_LIMIT = 100

export const GAME_LEAGUE_LEVELS: Record<GameLeagueLevelKey, GameLeagueLevel> = {
  easy: {
    id: 'easy',
    name: 'leagueName_easy',
    totalRowsLength: 3,
    initialRowSpacing: 600,
    initialSpeed: 2.5,
    nextLevelPoints: 50,
    showConfettiScore: 25,
    pointsPerMatch: 1,
  },
  medium: {
    id: 'medium',
    name: 'leagueName_medium',
    totalRowsLength: 5,
    initialRowSpacing: 400,
    initialSpeed: 2.5,
    nextLevelPoints: 120,
    showConfettiScore: 50,
    pointsPerMatch: 2,
  },
  hard: {
    id: 'hard',
    name: 'leagueName_hard',
    totalRowsLength: 7,
    initialRowSpacing: 300,
    initialSpeed: 2.5,
    nextLevelPoints: 200,
    showConfettiScore: 120,
    pointsPerMatch: 3,
  },
  legend: {
    id: 'legend',
    name: 'leagueName_legend',
    totalRowsLength: 9,
    initialRowSpacing: 200,
    initialSpeed: 2.5,
    nextLevelPoints: 400,
    showConfettiScore: 200,
    pointsPerMatch: 4,
  },
}
