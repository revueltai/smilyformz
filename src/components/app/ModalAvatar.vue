<script setup lang="ts">
  import { ref } from 'vue'
  import { AVATAR_DEFAULTS } from '@/configs/constants'
  import AvatarPreview from '@/components/app/AvatarPreview.vue'
  import AvatarCustomizer from '@/components/app/AvatarCustomizer.vue'
  import type { TileShape } from '@/components/app/TileShape.vue'
  import type { TileExpression } from '@/components/app/TileExpression.vue'

  const colorShape = ref(AVATAR_DEFAULTS.shapeColor)

  const colorBackground = ref(AVATAR_DEFAULTS.backgroundColor)

  const avatarShape = ref<TileShape>(AVATAR_DEFAULTS.shape as TileShape)

  const avatarExpression = ref<TileExpression>(AVATAR_DEFAULTS.expression as TileExpression)

  function handleSave() {
    console.log('save')
  }

  function handleUpdateShape(shape: TileShape) {
    avatarShape.value = shape
  }

  function handleUpdateExpression(expression: TileExpression) {
    avatarExpression.value = expression
  }

  function handleUpdateColorShape(color: string) {
    colorShape.value = color
  }

  function handleUpdateColorBackground(color: string) {
    colorBackground.value = color
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <AvatarPreview
      :color-shape="colorShape"
      :color-background="colorBackground"
      :shape="avatarShape"
      :expression="avatarExpression"
      @update:color-shape="handleUpdateColorShape"
      @update:color-background="handleUpdateColorBackground"
    />

    <AvatarCustomizer
      :shape="avatarShape"
      :expression="avatarExpression"
      @update:shape="handleUpdateShape"
      @update:expression="handleUpdateExpression"
    />

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
