<script setup lang="ts">
  import { ref } from 'vue'
  import { TILE_DEFAULTS } from '@/configs/constants'
  import { useUserStore } from '@/stores/user.store'
  import { useModalStore } from '@/stores/modal.store'
  import AvatarPreview from '@/components/app/AvatarPreview.vue'
  import AvatarCustomizer from '@/components/app/AvatarCustomizer.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import { ToastService } from '@/components/shared/Toast/service'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const userStore = useUserStore()
  const modalStore = useModalStore()

  const shapeColor = ref(userStore.profile?.avatar.shape_color || TILE_DEFAULTS.shapeColor)

  const backgroundColor = ref(
    userStore.profile?.avatar.background_color || TILE_DEFAULTS.backgroundColor,
  )

  const avatarShape = ref<TileShape>(
    userStore.profile?.avatar.shape || (TILE_DEFAULTS.shape as TileShape),
  )

  const avatarExpression = ref<TileExpression>(
    userStore.profile?.avatar.expression || (TILE_DEFAULTS.expression as TileExpression),
  )

  function handleUpdateShape(shape: TileShape) {
    avatarShape.value = shape
  }

  function handleUpdateExpression(expression: TileExpression) {
    avatarExpression.value = expression
  }

  function handleUpdateShapeColor(color: string) {
    shapeColor.value = color
  }

  function handleUpdateBackgroundColor(color: string) {
    backgroundColor.value = color
  }

  function handleSave() {
    userStore.updateUserSettings({
      avatar_shape: avatarShape.value,
      avatar_expression: avatarExpression.value,
      avatar_shape_color: shapeColor.value,
      avatar_background_color: backgroundColor.value,
    })

    modalStore.closeModal()
    ToastService.emitToast(t('avatarUpdated'), 'success')
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <AvatarPreview
      :shape-color="shapeColor"
      :background-color="backgroundColor"
      :shape="avatarShape"
      :expression="avatarExpression"
      @update:shape-color="handleUpdateShapeColor"
      @update:background-color="handleUpdateBackgroundColor"
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
