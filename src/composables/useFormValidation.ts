import { supabase } from '@/services/Supabase.service'

export interface ValidationResult {
  isValid: boolean
  message: string
}

export interface FormValidationOptions {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  country?: string
}

/**
 * Handles a form validation
 *
 * @returns The validation result and the validations
 */
export function useFormValidation() {
  /**
   * Validate the displayname/username field
   * Username must be at least 5 characters long and less than 15 characters.
   *
   * @param value - The username value
   * @returns The validation result
   */
  async function validateUsername(value: string): Promise<ValidationResult> {
    if (!value || value.trim() === '') {
      return { isValid: true, message: '' }
    }

    if (value.length < 5) {
      return { isValid: false, message: 'usernameMinLength' }
    }

    if (value.length > 15) {
      return { isValid: false, message: 'usernameMaxLength' }
    }

    const allowAlphanumericUnderscoresHyphensRegex = /^[a-zA-Z0-9_-]+$/
    if (!allowAlphanumericUnderscoresHyphensRegex.test(value)) {
      return { isValid: false, message: 'usernameInvalidChars' }
    }

    const isUnique = await supabase.isUsernameUnique(value)
    if (!isUnique) {
      return { isValid: false, message: 'usernameAlreadyExists' }
    }

    return { isValid: true, message: '' }
  }

  /**
   * Validate the email field
   *
   * @param value - The email value
   * @returns The validation result
   */
  async function validateEmail(
    value: string,
    checkUnique: boolean = true,
  ): Promise<ValidationResult> {
    if (!value || value.trim() === '') {
      return { isValid: true, message: '' }
    }

    const allowEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!allowEmailRegex.test(value)) {
      return { isValid: false, message: 'enterValidEmail' }
    }

    if (checkUnique) {
      const isUnique = await supabase.isEmailUnique(value)

      if (!isUnique) {
        return { isValid: false, message: 'emailAlreadyExists' }
      }
    }

    return { isValid: true, message: '' }
  }

  /**
   * Validate the password field
   *
   * @param value - The password value
   * @returns The validation result
   */
  function validatePassword(value: string): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: true, message: '' }
    }

    if (value.length < 8) {
      return { isValid: false, message: 'passwordMinLength' }
    }

    // Check for at least one uppercase letter, one lowercase letter, one number, and one symbol
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSymbol = /[!@#$%]/.test(value)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbol) {
      return {
        isValid: false,
        message: 'passwordRequirements',
      }
    }

    return { isValid: true, message: '' }
  }

  /**
   * Validate the confirm password field
   *
   * @param value - The confirm password value
   * @param password - The password value
   * @returns The validation result
   */
  function validateConfirmPassword(value: string, password: string): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: true, message: '' } // Let Input component handle required validation
    }

    if (value !== password) {
      return { isValid: false, message: 'passwordsDoNotMatch' }
    }

    return { isValid: true, message: '' }
  }

  /**
   * Validate the country field
   *
   * @param value - The country value
   * @returns The validation result
   */
  function validateCountry(value: string): ValidationResult {
    if (!value || value === '') {
      return { isValid: true, message: '' } // Let Select component handle required validation
    }
    return { isValid: true, message: '' }
  }

  /**
   * Get the default validation result
   *
   * @returns The default validation result
   */
  function getDefaultValidation(): ValidationResult {
    return { isValid: true, message: '' }
  }

  /**
   * Validate the form
   *
   * @param options - The form options
   * @returns The validation result
   */
  async function validateForm(options: FormValidationOptions) {
    const validations: Record<string, ValidationResult> = {}

    // Validate username
    if (options.username) {
      validations.username = await validateUsername(options.username)
    } else {
      validations.username = getDefaultValidation()
    }

    // Validate email
    if (options.email) {
      validations.email = await validateEmail(options.email)
    } else {
      validations.email = getDefaultValidation()
    }

    // Validate password
    if (options.password) {
      validations.password = validatePassword(options.password)
    } else {
      validations.password = getDefaultValidation()
    }

    // Validate confirm password
    if (options.confirmPassword && options.password) {
      validations.confirmPassword = validateConfirmPassword(
        options.confirmPassword,
        options.password,
      )
    } else {
      validations.confirmPassword = getDefaultValidation()
    }

    // Validate country
    if (options.country) {
      validations.country = validateCountry(options.country)
    } else {
      validations.country = getDefaultValidation()
    }

    const isValid = Object.values(validations).every((validation) => validation.isValid)

    return { isValid, validations }
  }

  return {
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateCountry,
    validateForm,
  }
}
