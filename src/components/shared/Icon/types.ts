import type { Color } from '@/types/theme'

export type IconSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type IconType = 'fill' | 'stroke' | 'both'
export type IconStrokeWidth = '0' | '1' | '2' | '4' | '8' | 0 | 1 | 2 | 4 | 8
export type IconName =
  | ''
  | 'none'
  | 'eye'
  | 'eye-off'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'asterisk'
  | 'award'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-help'
  | 'circle-user-round'
  | 'cross'
  | 'globe'
  | 'help'
  | 'house'
  | 'list-ordered'
  | 'log-in'
  | 'minus'
  | 'paint-bucket'
  | 'paintbrush-vertical'
  | 'pause'
  | 'pencil'
  | 'pipette'
  | 'play'
  | 'plus'
  | 'refresh-cw'
  | 'scan-face'
  | 'search'
  | 'settings-2'
  | 'settings'
  | 'shapes'
  | 'share-2'
  | 'triangle-alert'
  | 'trophy'
  | 'user-round'
  | 'user-search'

export interface IconProps {
  name: IconName
  type?: IconType
  size?: IconSizeName
  strokeWidth?: IconStrokeWidth
  color?: Color
  iconset?: string
}
