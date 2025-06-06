import type { Color } from '@/types/theme'

type LoaderSizes = 'sm' | 'md' | 'lg'

export interface LoaderProps {
  color?: Color
  size?: LoaderSizes
}
