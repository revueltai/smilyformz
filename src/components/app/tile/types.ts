export type TileShape = 'circle' | 'square' | 'triangle' | 'rhomb' | 'star'

export type TileSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type TileExpression = 'exp1' | 'exp2' | 'exp3' | 'exp4'

export type TileExpressionPowerDown = 'exp5' | 'exp6'

export type TilePowerUpType = 'none' | 'doublePoints' | 'anyShape' | 'anyColor'

export type TileColor = {
  shapeColor: string
  backgroundColor: string
}

export type TileRow = {
  id: string
  type: 'TileRow'
  tiles: TileRowItem[]
}

export interface TileRowItem {
  id: string
  type: 'Tile'
  shape: TileShape
  size: TileSize
  expression: TileExpression | TileExpressionPowerDown
  shapeColor: string
  backgroundColor: string
  powerUpType?: TilePowerUpType
}

export interface CharacterItem extends Omit<TileRowItem, 'type'> {
  type: 'character'
}
