import type { InputTypeHTMLAttribute } from 'vue'
import type { Color } from '@/types/theme'
import type { IconName, IconType } from '../Icon/types'

export interface InputProps {
  label?: string
  labelColor?: Color
  footnote?: string
  footnoteColor?: Color
  placeholder?: string
  name?: string
  maxlength?: number
  cssClassesField?: string
  required?: boolean
  requiredMessage?: string
  disabled?: boolean
  isEditable?: boolean
  showStaticField?: boolean
  showInputField?: boolean
  type?: InputTypeHTMLAttribute
  iconName?: IconName
  iconType?: IconType
  iconColor?: Color
  hasClickableIcon?: boolean
  showEditIcon?: boolean
  externalError?: string
  forceInvalid?: boolean
}
