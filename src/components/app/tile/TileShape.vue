<script setup lang="ts">
  import { computed } from 'vue'
  import { TILE_DEFAULTS } from '@/configs/constants'
  import type { TileShape, TileSize } from '@/components/app/tile/types'

  const props = withDefaults(
    defineProps<{
      shape: TileShape
      size?: TileSize
      color?: string
    }>(),
    {
      size: 'sm',
      color: TILE_DEFAULTS.shapeColor,
    },
  )

  const SIZES = {
    xs: 40,
    sm: 80,
    md: 120,
    lg: 160,
    xl: 200,
    '2xl': 240,
  }

  const PATHS = {
    circle:
      'M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z',
    square:
      'M0 16C0 7.16344 7.16344 0 16 0H64C72.8366 0 80 7.16344 80 16V64C80 72.8366 72.8366 80 64 80H16C7.16344 80 0 72.8366 0 64V16Z',
    triangle:
      'M31.5235 5.44682C35.2908 -1.81559 44.7092 -1.81561 48.4765 5.4468L78.6741 63.6596C82.4414 70.922 77.7322 80 70.1976 80H9.80245C2.26777 80 -2.44142 70.922 1.32592 63.6596L31.5235 5.44682Z',
    rhomb:
      'M28.6912 4.68428C34.9369 -1.56142 45.0631 -1.56143 51.3088 4.68427L75.3157 28.6912C81.5614 34.9369 81.5614 45.0631 75.3157 51.3088L51.3088 75.3157C45.0631 81.5614 34.9369 81.5614 28.6912 75.3157L4.68428 51.3088C-1.56142 45.0631 -1.56143 34.9369 4.68427 28.6912L28.6912 4.68428Z',
    star: 'M33.8388 3.68992C36.5892 -1.22998 43.4108 -1.22997 46.1612 3.68993L54.1696 18.0158C55.1771 19.8181 56.8653 21.096 58.8217 21.5375L74.3732 25.0462C79.7139 26.2512 81.822 33.0109 78.181 37.2566L67.579 49.6192C66.2453 51.1745 65.6004 53.2423 65.8021 55.3173L67.4049 71.8117C67.9554 77.4764 62.4365 81.6541 57.436 79.3582L42.8752 72.6728C41.0434 71.8318 38.9566 71.8318 37.1248 72.6728L22.564 79.3582C17.5635 81.6541 12.0446 77.4764 12.5951 71.8117L14.1979 55.3173C14.3996 53.2423 13.7547 51.1745 12.421 49.6192L1.81903 37.2566C-1.82196 33.0109 0.286059 26.2512 5.62684 25.0462L21.1783 21.5375C23.1347 21.096 24.8229 19.8181 25.8304 18.0158L33.8388 3.68992Z',
  }

  const currentPath = computed(() => PATHS[props.shape])

  const currentSize = computed(() => SIZES[props.size])
</script>

<template>
  <div class="relative">
    <svg
      :width="currentSize"
      :height="currentSize"
      :viewBox="`0 0 ${currentSize} ${currentSize}`"
      class="object-contain"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="currentPath"
        :fill="color"
        class="shape-morph"
      />
    </svg>
  </div>
</template>

<style scoped>
  .shape-morph {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
