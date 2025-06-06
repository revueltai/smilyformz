import type { Color } from '@/types/theme'
import type { IconName, IconType } from '../Icon/types'

interface FormSelectOption {
  value: string | number
  label: string
  icon?: string
  image?: string
}

export interface SelectProps {
  label?: string
  labelColor?: Color
  name: string
  selectLabel?: string
  showPlaceholderOption?: boolean
  required?: boolean
  disabled?: boolean
  asset?: string
  iconName?: IconName
  iconType?: IconType
  iconColor?: Color
  options?: FormSelectOption[]
  hasClickableIcon?: boolean
}
