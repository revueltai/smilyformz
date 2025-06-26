<script setup lang="ts">
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileRowItem } from '@/components/app/tile/types'
  import { createCssVar } from '@/utils'

  defineProps<{
    tiles: TileRowItem[]
  }>()
</script>

<template>
  <div class="tile-row w-full absolute">
    <div
      class="tile-row-grid grid gap-2 p-2 opacity-90"
      :style="createCssVar('total-rows-length', tiles.length.toString())"
    >
      <Tile
        v-for="tile in tiles"
        :key="tile.id"
        :ref="tile.id"
        :id="tile.id"
        :data-id="tile.id"
        :shape="tile.shape"
        :size="tile.size"
        :expression="tile.expression"
        :shape-color="tile.shapeColor"
        :background-color="tile.backgroundColor"
        :check-for-collision="true"
        :power-up-type="tile.powerUpType"
      />
    </div>
  </div>
</template>

<style scoped>
  .tile-row {
    will-change: transform;
  }

  .tile-row-grid {
    grid-template-columns: repeat(var(--total-rows-length), minmax(0, 1fr));
  }
</style>
