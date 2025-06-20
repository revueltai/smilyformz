<script setup lang="ts">
  import { useUserStore } from '@/stores/user.store'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileShape, TileExpression } from '@/components/app/tile/types'

  const userStore = useUserStore()

  const props = withDefaults(
    defineProps<{
      userName: string
      hasEditOptions?: boolean
    }>(),
    {
      userName: '',
      hasEditOptions: false,
    },
  )

  const emit = defineEmits<{
    'update:userName': [value: string]
    editUsername: []
    editAvatar: []
  }>()

  function handleClickEditUsername() {
    emit('editUsername')
  }

  function handleClickEditAvatar() {
    emit('editAvatar')
  }
</script>

<template>
  <header class="flex flex-col items-center justify-end gap-3 text-center h-48 mt-8">
    <div class="relative">
      <div
        class="flex gap-3 items-center justify-center w-28 h-28 rounded-full overflow-hidden bg-slate-200"
      >
        <Tile
          v-if="userStore.profile"
          :id="userStore.profile.id"
          :shape="userStore.profile.avatar.shape"
          :shape-color="userStore.profile.avatar.shape_color"
          :background-color="userStore.profile.avatar.background_color"
          :expression="userStore.profile.avatar.expression"
          size="2xl"
        />
      </div>

      <Button
        v-if="hasEditOptions"
        size="sm"
        class="absolute bottom-0 right-0"
        @click="handleClickEditAvatar"
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
        :model-value="userName"
        :is-editable="hasEditOptions"
        css-classes-field="text-2xl text-slate-600"
        show-static-field
        @update:model-value="(value) => emit('update:userName', value)"
        @click="hasEditOptions ? handleClickEditUsername() : undefined"
      />
    </div>
  </header>
</template>
