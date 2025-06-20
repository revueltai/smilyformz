<script setup lang="ts">
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileShape, TileExpression } from '@/components/app/tile/types'
  import { TILE_DEFAULTS } from '@/configs/constants'

  const props = withDefaults(
    defineProps<{
      displayName: string
      hasEditOptions?: boolean
      avatarShape?: TileShape
      avatarShapeColor?: string
      avatarBackgroundColor?: string
      avatarExpression?: TileExpression
    }>(),
    {
      displayName: '',
      hasEditOptions: false,
      avatarShape: TILE_DEFAULTS.shape,
      avatarShapeColor: TILE_DEFAULTS.shapeColor,
      avatarBackgroundColor: TILE_DEFAULTS.backgroundColor,
      avatarExpression: TILE_DEFAULTS.expression,
    },
  )

  const emit = defineEmits<{
    'update:displayName': [value: string]
    editAvatar: []
  }>()

  function handleAvatarClick() {
    emit('editAvatar')
  }

  function handleUpdateDisplayName(value: string) {
    // Only emit when user clicks the update button, not on every keystroke
    emit('update:displayName', value)
  }
</script>

<template>
  <header class="flex flex-col items-center justify-end gap-3 text-center h-48 mt-8">
    <div class="relative">
      <div
        class="flex gap-3 items-center justify-center w-28 h-28 rounded-full overflow-hidden bg-slate-200"
      >
        <Tile
          :id="'user-avatar'"
          :shape="avatarShape"
          :shape-color="avatarShapeColor"
          :background-color="avatarBackgroundColor"
          :expression="avatarExpression"
          size="2xl"
        />
      </div>

      <Button
        v-if="hasEditOptions"
        size="sm"
        class="absolute bottom-0 right-0"
        @click="handleAvatarClick"
      >
        <Icon
          name="pencil"
          color="slate-700"
        />
      </Button>
    </div>

    <div class="flex flex-col gap-1">
      <p
        v-if="!hasEditOptions"
        class="text-sm text-slate-400"
      >
        {{ $t('welcomeBack') }}
      </p>

      <Input
        :model-value="displayName"
        :is-editable="hasEditOptions"
        css-classes-field="text-2xl text-slate-600"
        show-static-field
        @update="handleUpdateDisplayName"
      />
    </div>
  </header>
</template>
