import type { Color } from '@/types/theme'
import type { RouteLocationRaw } from 'vue-router'

export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'

export type ButtonType = 'submit' | 'button' | 'link'

export type ButtonFormTypes = 'submit' | 'button' | 'reset' | undefined

export interface ButtonProps {
  size?: ButtonSize
  type?: ButtonType
  backgroundColor?: Color
  backgroundColorHover?: Color
  borderColor?: Color
  borderColorHover?: Color
  textColor?: Color
  cssClasses?: string
  activeClass?: string
  textAlignment?: 'center'
  to?: RouteLocationRaw | string | null
  disabled?: boolean
  isUnstyled?: boolean
  triggerKey?: string
  exact?: boolean
}
