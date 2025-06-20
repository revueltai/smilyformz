import { useI18n } from 'vue-i18n'

export interface Language {
  code: string
  i18nValue: string
}

/**
 * List of languages with their code, name, and flag
 */
export const LANGUAGES: Language[] = [
  { code: 'en', i18nValue: 'lang_en' },
  { code: 'es', i18nValue: 'lang_es' },
  { code: 'fr', i18nValue: 'lang_fr' },
  { code: 'de', i18nValue: 'lang_de' },
  { code: 'it', i18nValue: 'lang_it' },
]

export const DEFAULT_LANGUAGE_CODE = 'en'

/**
 * Format languages for use in Select components
 *
 * @returns Array of SelectOption objects with value and label properties
 */
export function getLanguagesForSelect() {
  const { t } = useI18n()

  return LANGUAGES.map((language) => ({
    value: language.code,
    label: t(language.i18nValue),
  }))
}
