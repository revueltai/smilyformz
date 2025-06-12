<script setup lang="ts">
  import { ref } from 'vue'
  import ColorPicker from '@/components/shared/ColorPicker/index.vue'
  import Tile from '@/components/app/Tile.vue'
  import { AVATAR_SHAPES } from '@/configs/constants'

  interface Props {
    onSave?: (avatar: AvatarConfig) => void
  }

  interface AvatarConfig {
    shape: string
    shapeColor: string
    backgroundColor: string
  }

  const props = withDefaults(defineProps<Props>(), {
    onSave: undefined,
  })

  const shapeColor = ref('#64748B') // slate-500
  const backgroundColor = ref('#64748B') // slate-500
  const currentShape = ref(AVATAR_SHAPES.CIRCLE)

  const shapes = Object.values(AVATAR_SHAPES)

  function handleSave() {
    if (props.onSave) {
      props.onSave({
        shape: currentShape.value,
        shapeColor: shapeColor.value,
        backgroundColor: backgroundColor.value,
      })
    }
  }

  function handleShapeChange(shape: string) {
    currentShape.value = shape
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="relative flex flex-col items-center justify-center gap-2 rounded-lg p-3 h-40 bg-slate-100"
    >
      <div class="absolute top-0 left-0 pt-3 pl-3">
        <ColorPicker
          v-model:color="shapeColor"
          label="Shape Color"
          class="mb-2"
        />

        <ColorPicker
          v-model:color="backgroundColor"
          label="Background"
        />
      </div>

      <Tile
        :shape="currentShape"
        :color="shapeColor"
      />
    </div>

    <div class="flex flex-col gap-3 rounded-lg p-2 bg-slate-100">
      <div class="w-full overflow-y-hidden overflow-x-auto bg-slate-200 rounded-sm p-1">
        <div class="flex gap-3">
          <Button
            v-for="shape in shapes"
            :key="shape"
            size="sm"
            :class="{ 'border-2 border-lime-600': shape === currentShape }"
            @click="handleShapeChange(shape)"
          >
            <Tile
              :shape="shape"
              :size="32"
              :color="shapeColor"
            />
          </Button>
        </div>
      </div>
    </div>

    <Button
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      text-color="lime-800"
      class="flex-1"
      @click="handleSave"
    >
      {{ $t('save') }}
    </Button>
  </div>
</template>
