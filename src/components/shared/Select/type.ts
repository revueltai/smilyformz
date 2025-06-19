import type { Color } from '@/types/theme'
import type { IconName, IconType } from '../Icon/types'

interface SelectOption {
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
  options?: SelectOption[]
  hasClickableIcon?: boolean
  isEditable?: boolean
  showSelectField?: boolean
  showStaticField?: boolean
  cssClassesField?: string
  footnote?: string
  footnoteColor?: Color
  showEditIcon?: boolean
}
