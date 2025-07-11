<script setup lang="ts">
  import { useModalStore } from '@/stores/modal.store'
  import ModalTutorial from './ModalTutorial.vue'
  import { computed, ref } from 'vue'
  import { useFloatingTiles } from '@/composables/useFloatingTiles'
  import Button from '@/components/shared/Button/index.vue'
  import Icon from '@/components/shared/Icon/index.vue'
  import Modal from '@/components/shared/Modal/index.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileShape, TileExpression, TileSize } from '@/components/app/tile/types'

  const props = withDefaults(
    defineProps<{
      hasTutorialButton?: boolean
      backButtonTo?: string | null
      contentIsCentered?: boolean
      contentClasses?: string
      floatingTiles?: boolean
    }>(),
    {
      contentIsCentered: false,
      hasTutorialButton: false,
      backButtonTo: null,
      contentClasses: '',
      floatingTiles: false,
    },
  )

  const modalStore = useModalStore()

  const containerRef = ref<HTMLElement>()

  const { tiles } = useFloatingTiles(containerRef, props.floatingTiles)

  const cssClasses = computed(() => ({
    'content-center': props.contentIsCentered,
    [props.contentClasses]: props.contentClasses,
  }))

  function handleClickButtonTutorial() {
    modalStore.openModal('tutorial')
  }
</script>

<template>
  <div
    ref="containerRef"
    class="relative h-full"
  >
    <Button
      v-if="hasTutorialButton"
      border-color="slate-300"
      border-color-hover="slate-200"
      color="white"
      class="absolute top-6 right-6 z-20"
      @click="handleClickButtonTutorial"
    >
      <Icon
        name="help"
        color="slate-700"
      />
    </Button>

    <Button
      v-if="backButtonTo"
      color="white"
      class="absolute top-6 left-0 ml-[-1px] rounded-tl-none rounded-bl-none z-20"
      :to="backButtonTo"
    >
      <Icon name="arrow-left" />
    </Button>

    <div
      v-if="floatingTiles"
      class="absolute inset-0 pointer-events-none z-0 opacity-10"
    >
      <div
        v-for="tile in tiles"
        :key="tile.id"
        class="absolute transition-transform duration-100"
        :style="{
          left: `${tile.x}px`,
          top: `${tile.y}px`,
        }"
      >
        <Tile
          :id="`deco-${tile.id}`"
          :shape="tile.shape"
          :size="tile.tileSize"
          :expression="tile.expression"
          :shape-color="tile.color"
        />
      </div>
    </div>

    <div
      class="relative h-full overflow-y-auto z-10 p-6"
      :class="cssClasses"
    >
      <slot />
    </div>

    <Modal
      v-if="hasTutorialButton"
      name="tutorial"
      :heading="$t('howToPlay')"
    >
      <ModalTutorial />
    </Modal>
  </div>
</template>
