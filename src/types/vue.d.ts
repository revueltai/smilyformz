import type { DefineLocaleMessage } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string | number) => string
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
