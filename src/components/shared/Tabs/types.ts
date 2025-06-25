export type TabSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

export interface TabItem {
  id: string
  label: string
  value?: any
}

export interface TabProps {
  items: TabItem[]
  activeTab?: number
  size?: TabSize
  activeTabClasses?: string
  inactiveTabClasses?: string
  tabsContainerClasses?: string
  tabsContentClasses?: string
}
