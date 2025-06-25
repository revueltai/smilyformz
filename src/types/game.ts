export interface GameLeagueLevel {
  id: GameLeagueLevelKey
  name: string
  totalRowsLength: number
  initialRowSpacing: number
  initialSpeed: number
  nextLevelPoints: number
}

export type GameLeagueLevelKey = 'easy' | 'medium' | 'hard' | 'legend'

export interface LeagueRankingItem {
  position: number
  username: string
  score: string | number
  country: string
  league: string
}

export interface LeagueRankingListRankItem extends Omit<LeagueRankingItem, 'league'> {
  league: GameLeagueLevelKey
}
