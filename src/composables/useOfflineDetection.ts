import { ref, onMounted, onUnmounted } from 'vue'
import { useModalStore } from '@/stores/modal.store'
import { MODALS } from '@/configs/constants'

export function useOfflineDetection() {
  const isOnline = ref(navigator.onLine)
  const modalStore = useModalStore()

  function handleOnline() {
    isOnline.value = true
    if (modalStore.isOpen(MODALS.OFFLINE)) {
      modalStore.closeModal()
    }
  }

  function handleOffline() {
    isOnline.value = false
    modalStore.openModal(MODALS.OFFLINE)
  }

  function handleRetry() {
    if (navigator.onLine) {
      modalStore.closeModal()
    }
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial state
    if (!navigator.onLine) {
      handleOffline()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    isOnline,
    handleRetry,
  }
}
