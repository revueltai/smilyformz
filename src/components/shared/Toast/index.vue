<script setup lang="ts">
  import { ToastService } from './service'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { ToastType, ToastPayload } from '@/components/shared/Toast/types'
  import type { RefElement } from '@/components/shared/types'
  import { useSoundStore } from '@/stores/sounds.store'

  const { t } = useI18n()
  const soundStore = useSoundStore()

  const toastRef = ref<RefElement>(null)
  const message = ref('')
  const type = ref<ToastType>('info')
  const isVisible = ref(false)

  const cssClasses = computed(() => {
    return {
      'bg-blue-50 border-blue-300': type.value === 'info',
      'bg-lime-50 border-lime-300': type.value === 'success',
      'bg-rose-50 border-rose-300': type.value === 'error',
    }
  })

  function handleAnimationEnd(event: AnimationEvent) {
    event.stopPropagation()

    const targetEl = event.target as HTMLElement
    targetEl.classList.remove('slideInOutTop')
    isVisible.value = false
    message.value = ''
  }

  function showToast(payload: ToastPayload) {
    if (!isVisible.value) {
      isVisible.value = true
      type.value = payload.type || 'info'
      message.value = payload.translateMessage ? t(payload.message) : payload.message

      if (toastRef.value) {
        toastRef.value.addEventListener('animationend', handleAnimationEnd)
        toastRef.value.classList.add('slideInOutTop')

        soundStore.playSound(type.value === 'error' ? 'notificationError' : 'notificationSuccess')
      }
    }
  }

  onMounted(() => ToastService.emitter.on('toast', showToast))

  onUnmounted(() => {
    ToastService.emitter.off('toast', showToast)

    if (toastRef.value) {
      toastRef.value.removeEventListener('animationend', handleAnimationEnd)
    }
  })
</script>

<template>
  <div
    v-show="isVisible"
    ref="toastRef"
    class="absolute top-0 left-0 w-full z-50 p-4"
  >
    <div
      class="min-w-40 text-center shadow-lg top-0 px-8 py-4 rounded-lg border text-slate-600 text-sm sm:text-base"
      :class="cssClasses"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
  .slideInOutTop {
    animation: slideInOutTop 1800ms ease-in-out;
  }
</style>
