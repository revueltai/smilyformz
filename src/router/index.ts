import type { I18n } from 'vue-i18n'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'
import {
  getLocale,
  isI18nInitialized,
  // loadLocaleMessages,
  // setI18nLanguage,
} from '@/services/i18n.service'
import type { AppLocaleCode } from '@/types'

async function setI18nAppLanguage(i18n: I18n) {
  // const settingsStore = useSettingsStore()
  const appCurrentLocale = getLocale(i18n) as AppLocaleCode

  if (!isI18nInitialized) {
    // if (settingsStore.appLocales.includes(appCurrentLocale)) {
    //   if (!i18n.global.availableLocales.includes(appCurrentLocale)) {
    //     await loadLocaleMessages(i18n, appCurrentLocale)
    //   }
    //   setI18nLanguage(i18n, appCurrentLocale)
    // }
  }
}

// Define public routes that don't require authentication
const publicRoutes = ['Splash', 'Game']

async function validateUser(to: RouteLocationNormalized): Promise<{ name: string } | undefined> {
  // Import the store dynamically to avoid calling useUserStore at module level
  const { useUserStore } = await import('@/stores/user.store')
  const userStore = useUserStore()
  const isPublicRoute = publicRoutes.includes(to.name as string)

  // Initialize user store if not already done
  if (!userStore.isAuthenticated && userStore.isLoading === false) {
    await userStore.initialize()
  }

  // If user is not authenticated and trying to access a protected route
  if (!userStore.isAuthenticated && !isPublicRoute) {
    return { name: 'Splash' }
  }

  // If user is authenticated and trying to access splash page, redirect to home
  if (userStore.isAuthenticated && to.name === 'Splash') {
    return { name: 'Home' }
  }

  return undefined
}

export function setupRouter(i18n: I18n, initialLocale: AppLocaleCode): Router {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Splash',
      component: () => import('../views/SplashView.vue'),
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/ranking',
      name: 'Ranking',
      component: () => import('../views/RankingView.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('../views/GameView.vue'),
    },
  ]

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    strict: true,
    routes,
  })

  router.beforeEach(async (to, from, next) => {
    // const modalStore = useModalStore()
    // modalStore.closeModal()

    setI18nAppLanguage(i18n)

    // const settingsStore = useSettingsStore()

    i18n.global.locale = 'en' //settingsStore.appLocales.includes(initialLocale) ? initialLocale : 'en'

    const route = await validateUser(to)

    if (route) {
      next(route)
    } else {
      next()
    }
  })

  return router
}
