export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastPayload {
  message: string
  type: ToastType
  translateMessage?: boolean
}
