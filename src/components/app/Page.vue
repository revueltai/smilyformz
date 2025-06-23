<script setup lang="ts">
  import { useModalStore } from '@/stores/modal.store'
  import ModalTutorial from './ModalTutorial.vue'
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      hasTutorialButton?: boolean
      backButtonTo?: string | null
      contentIsCentered?: boolean
      contentClasses?: string
    }>(),
    {
      contentIsCentered: false,
      hasTutorialButton: false,
      backButtonTo: null,
      contentClasses: '',
    },
  )

  const modalStore = useModalStore()

  const cssClasses = computed(() => ({
    'content-center': props.contentIsCentered,
    [props.contentClasses]: props.contentClasses,
  }))

  function handleClickButtonTutorial() {
    modalStore.openModal('tutorial')
  }
</script>

<template>
  <div class="relative h-full">
    <Button
      v-if="hasTutorialButton"
      border-color="slate-300"
      border-color-hover="slate-200"
      color="white"
      class="absolute top-6 right-6 z-10"
      @click="handleClickButtonTutorial"
    >
      <Icon
        name="help"
        color="slate-400"
      />
    </Button>

    <Button
      v-if="backButtonTo"
      color="white"
      class="absolute top-6 left-0 ml-[-1px] rounded-tl-none rounded-bl-none z-10"
      :to="backButtonTo"
    >
      <Icon name="arrow-left" />
    </Button>

    <div
      class="relative h-full overflow-y-auto z-0 p-6"
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
