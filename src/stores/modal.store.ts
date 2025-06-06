import { defineStore } from 'pinia'

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
