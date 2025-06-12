export const mockRankings = Array.from({ length: 100 }, (_, i) => ({
  position: i + 1,
  username: `Player ${i + 1}`,
  score: Math.floor(Math.random() * 50000),
  country: 'en',
}))
