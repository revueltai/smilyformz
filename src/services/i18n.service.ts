import type { I18n, I18nOptions, Locale } from 'vue-i18n'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { APP_DEFAULT_LOCALE, APP_LOCALES } from '@/configs/constants'

export type AppLocaleCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt'

const getResourceMessages = (r: any) => r.default || r

// eslint-disable-next-line import/no-mutable-exports
export let isI18nInitialized = false

// eslint-disable-next-line import/no-mutable-exports
export let globalI18nInstance: I18n | null = null

const localStorage = useLocalStorage()
const LANGUAGE_STORAGE_KEY = 'app_language'

/**
 * Gets the saved language preference from localStorage or user store
 * Falls back to browser detection if no preference is found
 */
export function getSavedLanguage(): AppLocaleCode {
  const savedLanguage = localStorage.get(LANGUAGE_STORAGE_KEY)

  if (savedLanguage && isValidAppLocale(savedLanguage)) {
    return savedLanguage as AppLocaleCode
  }

  // Fall back to browser detection
  return detectBrowserLanguage() as AppLocaleCode
}

/**
 * Saves the language preference to localStorage
 */
export function saveLanguagePreference(locale: AppLocaleCode): void {
  localStorage.set(LANGUAGE_STORAGE_KEY, locale)
}

/**
 * Validates if a locale is a valid app locale
 */
export function isValidAppLocale(locale: string): locale is AppLocaleCode {
  return APP_LOCALES.includes(locale as AppLocaleCode)
}

/**
 * Detects the browser's language setting.
 * If no language is detected, it returns the provided fallback language.
 *
 * @param fallback - The fallback language to use if no browser language is detected.
 * @returns The detected or fallback language.
 */
export function detectBrowserLanguage(fallback: string = APP_DEFAULT_LOCALE): string {
  const browserLocale = navigator.language || navigator.languages?.[0] || fallback
  const detectedLocale = browserLocale.split('-')[0]

  return isValidAppLocale(detectedLocale) ? detectedLocale : fallback
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
export function setupI18n(options: I18nOptions = { locale: APP_DEFAULT_LOCALE }): I18n {
  const i18n = createI18n(options)
  globalI18nInstance = i18n
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
    try {
      const messages = await import(`@/configs/locales/${locale}.json`).then(getResourceMessages)
      i18n.global.setLocaleMessage(locale, messages)
    } catch (error) {
      console.warn(`Failed to load locale messages for ${locale}, falling back to English`, error)

      if (locale !== APP_DEFAULT_LOCALE) {
        await loadLocaleMessages(i18n, APP_DEFAULT_LOCALE)
      }
    }
  }

  return nextTick()
}

/**
 * Changes the application language with persistence
 *
 * @param i18n - The i18n instance
 * @param locale - The new locale to set
 * @param savePreference - Whether to save the preference (default: true)
 */
export async function changeAppLanguage(
  i18n: I18n,
  locale: AppLocaleCode,
  savePreference: boolean = true,
): Promise<void> {
  if (!isValidAppLocale(locale)) {
    console.warn(`Invalid locale: ${locale}, falling back to English`)
    locale = APP_DEFAULT_LOCALE
  }

  // Load locale messages if not already loaded
  await loadLocaleMessages(i18n, locale)

  // Set the language
  setI18nLanguage(i18n, locale)

  // Save preference if requested
  if (savePreference) {
    saveLanguagePreference(locale)
  }
}

/**
 * Validates the application locale.
 *
 * @param locale - The locale to validate.
 * @param fallback - The fallback locale.
 * @returns The validated locale.
 */
export function validateAppLocale(
  locale: AppLocaleCode,
  fallback: string = APP_DEFAULT_LOCALE,
): AppLocaleCode {
  return isValidAppLocale(locale) ? locale : (fallback as AppLocaleCode)
}
