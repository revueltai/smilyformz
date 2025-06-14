<script setup lang="ts">
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileRowItem } from '@/components/app/tile/types'

  defineProps<{
    tiles: TileRowItem[]
  }>()
</script>

<template>
  <div class="grid grid-cols-3 gap-2 p-2 h-32">
    <Tile
      v-for="(tile, index) in tiles"
      :key="index"
      :shape="tile.shape"
      :expression="tile.expression"
      :shape-color="tile.shapeColor"
      :background-color="tile.backgroundColor"
    />
  </div>
</template>
