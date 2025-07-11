<script setup lang="ts">
  import { useSoundStore } from '@/stores/sounds.store'
  import type { TabProps, TabItem } from './types'

  const props = withDefaults(defineProps<TabProps>(), {
    items: () => [],
    activeTab: 0,
    activeTabClasses: 'text-slate-600',
    inactiveTabClasses: 'text-slate-300',
    tabsContainerClasses: '',
    tabsContentClasses: '',
    size: 'base',
  })

  const emit = defineEmits<{
    'update:activeTab': [index: number]
    tabChange: [index: number, item: TabItem]
  }>()

  const soundStore = useSoundStore()

  const tabSizeClasses = {
    xs: 'text-xs py-2 px-3',
    sm: 'text-sm py-2 px-3',
    base: 'text-sm py-3 px-4',
    lg: 'text-base py-3 px-4',
    xl: 'text-lg py-4 px-6',
  }

  function handleTabClick(index: number) {
    soundStore.playSound('buttonClick')
    emit('update:activeTab', index)
    emit('tabChange', index, props.items[index])
  }
</script>

<template>
  <div class="flex flex-col">
    <div
      class="w-full flex overflow-x-auto scrollbar-hide"
      :class="tabsContainerClasses"
    >
      <slot
        name="tabs"
        :items="items"
        :active-tab="activeTab"
        :active-tab-classes="activeTabClasses"
        :inactive-tab-classes="inactiveTabClasses"
        :handle-tab-click="handleTabClick"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="[
            tabSizeClasses[size],
            'font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap flex-shrink-0',
            index === activeTab ? activeTabClasses : inactiveTabClasses,
          ]"
          @click="handleTabClick(index)"
        >
          {{ item.label }}
        </div>
      </slot>
    </div>

    <div :class="tabsContentClasses">
      <slot
        :active-tab="activeTab"
        :active-item="items[activeTab]"
        :items="items"
      />
    </div>

    <slot name="footer" />
  </div>
</template>

<style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
