<script setup lang="ts">
  import { ref } from 'vue'
  import { TILE_SHAPES, TILE_EXPRESSIONS, TILE_DEFAULTS } from '@/configs/constants'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import Shape from '@/components/app/tile/TileShape.vue'
  import Expression from '@/components/app/tile/TileExpression.vue'

  type Tab = 'expression' | 'shape'

  interface Props {
    shape?: TileShape
    expression?: TileExpression
  }

  withDefaults(defineProps<Props>(), {
    shape: TILE_DEFAULTS.shape,
    expression: TILE_DEFAULTS.expression,
  })

  const tabs = ['expression', 'shape'] as Tab[]
  const shapes = Object.values(TILE_SHAPES) as TileShape[]
  const expressions = Object.values(TILE_EXPRESSIONS) as TileExpression[]

  const currentTab = ref<Tab>('expression')

  function isDisabled(tab: Tab) {
    return currentTab.value === tab
  }

  function handleChangeTab(tab: Tab) {
    currentTab.value = tab
  }
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg p-2 bg-slate-100">
    <div class="w-full overflow-x-auto bg-slate-200 rounded-sm p-3">
      <div class="flex gap-6 min-w-fit">
        <template v-if="isDisabled('expression')">
          <Expression
            v-for="exp in expressions"
            :key="exp"
            :expression="exp"
            class="cursor-pointer active:scale-95 transition-transform"
            @click="$emit('update:expression', exp)"
          />
        </template>

        <template v-if="isDisabled('shape')">
          <Shape
            v-for="shape in shapes"
            :key="shape"
            :shape="shape"
            size="xl"
            class="cursor-pointer active:scale-95 transition-transform"
            @click="$emit('update:shape', shape)"
          />
        </template>
      </div>
    </div>

    <div class="flex gap-3 justify-center">
      <Button
        v-for="tab in tabs"
        :key="tab"
        :disabled="isDisabled(tab)"
        @click="handleChangeTab(tab)"
        class="w-full"
      >
        <Icon
          :name="tab === 'expression' ? 'scan-face' : 'shapes'"
          size="md"
          color="slate-700"
        />
      </Button>
    </div>
  </div>
</template>
