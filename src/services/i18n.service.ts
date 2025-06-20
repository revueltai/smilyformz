import type { I18n, I18nOptions, Locale } from 'vue-i18n'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import type { AppLocaleCode } from '@/types'

const getResourceMessages = (r: any) => r.default || r

// eslint-disable-next-line import/no-mutable-exports
export let isI18nInitialized = false

/**
 * Detects the browser's language setting.
 * If no language is detected, it returns the provided fallback language.
 *
 * @param fallback - The fallback language to use if no browser language is detected.
 * @returns The detected or fallback language.
 */
export function detectBrowserLanguage(fallback: string = 'en'): string {
  const browserLocale = navigator.language || navigator.languages?.[0] || fallback
  return browserLocale.split('-')[0]
}

/**
 * Gets the current locale from the i18n instance.
 *
 * @param i18n - The i18n instance.
 * @returns The current locale.
 */
export function getLocale(i18n: I18n): string {
  return i18n.global.locale as string
}

/**
 * Sets the active locale in the i18n instance.
 *
 * @param i18n - The i18n instance.
 * @param locale - The new locale to set.
 */
export function setLocale(i18n: I18n, locale: Locale): void {
  i18n.global.locale = locale
}

/**
 * Sets up the i18n instance.
 *
 * @param options - The i18n options.
 * @returns The i18n instance.
 */
export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale as Locale)
  isI18nInitialized = true
  return i18n
}

/**
 * Sets the application language and updates the HTML lang attribute.
 *
 * @param i18n - The i18n instance.
 * @param locale - The locale to apply.
 */
export function setI18nLanguage(i18n: I18n, locale: Locale): void {
  setLocale(i18n, locale)
  document.querySelector('html')!.setAttribute('lang', locale)
}

/**
 * Dynamically loads and sets locale messages for the given locale.
 *
 * @param i18n - The i18n instance.
 * @param locale - The locale to load messages for.
 * @returns A promise that resolves on the next tick.
 */
export async function loadLocaleMessages(i18n: I18n, locale: Locale): Promise<void> {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(`@/configs/locales/${locale}.json`).then(getResourceMessages)

    i18n.global.setLocaleMessage(locale, messages)
  }

  return nextTick()
}

/**
 * Validates the application locale.
 *
 * @param locale - The locale to validate.
 * @param fallback - The fallback locale.
 * @returns The validated locale.
 */
export function validateAppLocale(locale: AppLocaleCode, fallback: string = 'en'): AppLocaleCode {
  // const settingsStore = useSettingsStore()
  // return settingsStore.appLocales.includes(locale) ? locale : fallback as AppLocaleCode
  return 'en' as AppLocaleCode
}
