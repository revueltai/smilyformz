export interface GameLeagueLevel {
  id: GameLeagueLevelKey
  name: string
  totalRowsLength: number
  initialRowSpacing: number
  initialSpeed: number
  nextLevelPoints: number
}

export type GameLeagueLevelKey = 'easy' | 'medium' | 'hard' | 'ultimate'
