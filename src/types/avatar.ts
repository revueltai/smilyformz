import type { Shape } from '@/components/app/Tile.vue'

export type Expression = 'default' | 'happy' | 'sad' | 'angry' | 'surprised'
export type AvatarItemType = 'shapes' | 'expressions'

export interface AvatarConfig {
  type: AvatarItemType
  shape: Shape | Expression
  shapeColor: string
  backgroundColor: string
}
