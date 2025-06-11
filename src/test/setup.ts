import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createI18n } from 'vue-i18n'

// Mock translations
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {},
  },
})

// Setup global components
config.global.components = {
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot/></a>',
    props: ['to'],
  },
}

// Setup global plugins
config.global.plugins = [i18n]

// Mock router
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
  },
  $route: {
    params: {},
    query: {},
    path: '/',
    name: 'test',
  },
}

// Other global test configuration
