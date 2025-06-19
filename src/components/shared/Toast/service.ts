import mitt from 'mitt'
import type { ToastPayload, ToastType } from './types'

/**
 * Service for emitting toast events to the Toast component
 */
export class ToastService {
  /**
   * The emitter for the toast event
   */
  static emitter = mitt<{ toast: ToastPayload }>()

  /**
   * Emits a toast event to the Toast component
   *
   * @param message - The message to display in the toast
   * @param type - The type of toast to display (info, success, error) (default: info)
   * @param translateMessage - Whether to translate the message
   */
  static emitToast(message: string, type: ToastType = 'info', translateMessage: boolean = false) {
    setTimeout(() => {
      this.emitter.emit('toast', { message, type, translateMessage })
    }, 100)
  }
}
