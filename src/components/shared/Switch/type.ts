export interface SwitchProps {
  direction?: 'row' | 'col'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  name?: string
  required?: boolean
  disabled?: boolean
  modelValue?: boolean
}
