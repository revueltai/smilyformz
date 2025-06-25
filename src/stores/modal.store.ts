import { defineStore } from 'pinia'

/**
 * Handles the modal state for the app.
 */
export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as string | null,
  }),

  actions: {
    openModal(name: string) {
      this.activeModal = name
    },

    closeModal() {
      this.activeModal = null
    },

    isOpen(name: string) {
      return this.activeModal === name
    },
  },
})
