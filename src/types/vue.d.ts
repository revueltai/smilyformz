import type { DefineLocaleMessage } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: keyof DefineLocaleMessage) => string
  }
}
