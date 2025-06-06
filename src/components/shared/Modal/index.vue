<script setup lang="ts">
  import { useModalStore } from '@/stores/modal.store'
  import type { ModalProps } from './types'

  withDefaults(defineProps<ModalProps>(), {
    containerEl: 'modal',
    hasCloseButton: true,
  })

  const emit = defineEmits(['close'])
  const modalStore = useModalStore()

  function handleClose() {
    modalStore.closeModal()
    emit('close')
  }
</script>

<template>
  <teleport
    v-if="modalStore.isOpen(name)"
    :to="`#${containerEl}`"
  >
    <dialog
      class="absolute inset-0 w-full h-full p-4 flex items-center justify-center z-50"
      @click.self="handleClose"
    >
      <div
        class="relative min-w-xs max-w-xs rounded-2xl shadow-2xl bg-white px-4 pt-8 pb-4 text-center sm:max-w-sm"
      >
        <Button
          v-if="hasCloseButton"
          background-color="rose-50"
          background-color-hover="rose-100"
          border-color="rose-600"
          border-color-hover="rose-800"
          class="absolute -top-2 -right-2 z-30"
          @click="handleClose"
        >
          <Icon
            name="cross"
            size="sm"
            stroke-width="2"
            color="rose-800"
          />
        </Button>

        <div
          v-if="$slots.header || heading"
          class="flex justify-between items-center mb-4 text-center w-full"
        >
          <div class="w-full">
            <h3
              v-if="heading"
              class="text-center w-full text-xl text-slate-700"
            >
              {{ heading }}
            </h3>

            <p
              v-if="byline"
              class="px-2 text-sm text-slate-400"
            >
              {{ byline }}
            </p>
          </div>

          <template v-if="$slots.header">
            <slot name="header" />
          </template>
        </div>

        <div class="text-sm">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="flex justify-end mt-4"
        >
          <slot name="footer" />
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped>
  dialog {
    background-color: rgba(15, 23, 43, 0.8);
  }
</style>
