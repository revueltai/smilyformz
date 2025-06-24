export interface NumberCounterProps {
  value: number
  duration?: number
  delay?: number
  easing?: 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out'
  formatNumber?: boolean
  prefix?: string
  suffix?: string
}
