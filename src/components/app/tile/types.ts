export type TileShape = 'circle' | 'square' | 'triangle' | 'rhomb' | 'star'

export type TileSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type TileExpression = 'exp1' | 'exp2' | 'exp3' | 'exp4' | 'exp5'

export type TileColor = {
  shapeColor: string
  backgroundColor: string
}

export type TileRow = {
  id: string
  type: 'TileRow'
  tiles: TileRowItem[]
}

export type TileRowItem = {
  id: string
  type: 'Tile'
  shape: TileShape
  expression: TileExpression
  shapeColor: string
  backgroundColor: string
}
