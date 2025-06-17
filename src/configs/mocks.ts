import { getRandomNumber } from '@/utils'

export const mockRankings = Array.from({ length: 100 }, (_, i) => ({
  position: i + 1,
  username: `Player ${i + 1}`,
  score: getRandomNumber(50000),
  country: 'en',
}))
