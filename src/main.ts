import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { getSavedLanguage, setupI18n, loadLocaleMessages } from '@/services/i18n.service'
import { setupRouter } from './router'
import { useUserStore } from '@/stores/user.store'

import Button from '@/components/shared/Button/index.vue'
import Loader from '@/components/shared/Loader/index.vue'
import Toast from '@/components/shared/Toast/index.vue'
import Label from '@/components/shared/Label/index.vue'
import Switch from '@/components/shared/Switch/index.vue'
import Input from '@/components/shared/Input/index.vue'
import Select from '@/components/shared/Select/index.vue'
import Modal from '@/components/shared/Modal/index.vue'
import Icon from '@/components/shared/Icon/index.vue'
import App from './App.vue'
import en from '@/configs/locales/en.json'
import { APP_DEFAULT_LOCALE } from '@/configs/constants'

/**
 * Initializes the user authentication system
 * Sets up the auth state change listener to automatically update user state
 * when users sign in/out through Supabase
 */
function initializeUserAuthentication() {
  const userStore = useUserStore()
  userStore.setupAuthListener()
}

const initialLocale = getSavedLanguage()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const i18n = setupI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: APP_DEFAULT_LOCALE,
  messages: { en },
})

if (initialLocale !== APP_DEFAULT_LOCALE) {
  loadLocaleMessages(i18n, initialLocale)
}

const router = setupRouter(i18n)
app.use(i18n)
app.use(router)

app.component('Loader', Loader)
app.component('Toast', Toast)
app.component('Label', Label)
app.component('Switch', Switch)
app.component('Input', Input)
app.component('Select', Select)
app.component('Icon', Icon)
app.component('Button', Button)
app.component('Modal', Modal)

initializeUserAuthentication()

router.isReady().then(() => app.mount('#app'))
