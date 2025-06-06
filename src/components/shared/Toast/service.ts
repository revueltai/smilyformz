import mitt from 'mitt'
import type { ToastPayload, ToastType } from './types'

export class ToastService {
  static emitter = mitt<{ toast: ToastPayload }>()

  static emitToast(message: string, type: ToastType, translateMessage: boolean = false) {
    this.emitter.emit('toast', { message, type, translateMessage })
  }
}
