/**
 * Checks if the input is a finite number.
 *
 * @param {unknown} input - The value to check.
 * @returns {boolean} True if the input is a finite number.
 */
export function isNumber(input: unknown): boolean {
  return typeof input === 'number' && Number.isFinite(input)
}

/**
 * Checks if the input is a string.
 *
 * @param {unknown} input - The value to check.
 * @returns {input is string} True if the input is a string.
 */
export function isString(input: unknown): input is string {
  return typeof input === 'string'
}

/**
 * Checks if the input is a plain object.
 *
 * @param {unknown} input - The value to check.
 * @returns {input is Record<string, unknown>} True if it's a plain object.
 */
export function isObject(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === 'object' && input !== null && Object.getPrototypeOf(input) === Object.prototype
  )
}

/**
 * Checks if the input is an array.
 *
 * @param {any[]} arr - The value to check.
 * @returns {boolean} True if the input is an array.
 */
export function isArray(arr: any[]): boolean {
  return Array.isArray(arr)
}

/**
 * Checks if the input is an empty plain object.
 *
 * @param {unknown} input - The value to check.
 * @returns {boolean} True if it's an empty object.
 */
export function isEmptyObject(input: unknown): boolean {
  return isObject(input) && Object.keys(input).length === 0
}

/**
 * Checks if the input is an empty array.
 *
 * @param {any[]} arr - The array to check.
 * @returns {boolean} True if it's empty.
 */
export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0
}

/**
 * Checks if the set is empty.
 *
 * @param {Set<any>} set - The set to check.
 * @returns {boolean} True if the set is empty.
 */
export function isEmptySet(set: Set<any>): boolean {
  return set.size === 0
}

/**
 * Sets a CSS variable on a given HTML element.
 *
 * @param {HTMLElement} el - The element to apply the CSS variable to.
 * @param {string} varName - The name of the variable (without `--` prefix).
 * @param {any} varValue - The value to assign to the variable.
 */
export function setCssVar(el: HTMLElement, varName: string, varValue: any) {
  el.style.setProperty(createCssVar(varName), String(varValue))
}

/**
 * Removes a CSS variable from an element's inline styles.
 *
 * @param {HTMLElement} el - The element to remove the CSS variable from.
 * @param {string} varName - The name of the CSS variable (without the "--" prefix).
 */
export function removeCssVar(el: HTMLElement, varName: string) {
  el.style.removeProperty(createCssVar(varName))
}

/**
 * Checks if the current device is a mobile device.
 *
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobile(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)
}

/**
 * Checks if the given event is a touch event.
 *
 * @param {any} event - The event to check.
 * @returns {boolean} True if the event is a touch event, otherwise false.
 */
export function isTouchEvent(event: any): boolean {
  return window.TouchEvent && event instanceof TouchEvent
}

/**
 * Checks if the input string is the token 'none'.
 *
 * @param {string} input - The string token to check.
 * @returns {boolean} True if the input is 'none', otherwise false.
 */
export function isNoneToken(input: string): boolean {
  return input === 'none'
}

/**
 * Converts a number to its negative form.
 *
 * @param {number} num - The number to make negative.
 * @returns {number} The negative value of the number.
 */
export function makeNegative(num: number): number {
  return -Math.abs(num)
}

/**
 * Creates a random string of lowercase letters.
 *
 * @param {number} [length] - The length of the random string.
 * @returns {string} A random string of the specified length.
 */
export function createRandomString(length: number = 4): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Creates a unique identifier (UID).
 *
 * @param {string} [value] - An optional value to append to the UID.
 * @returns {string} A unique identifier string.
 */
export function createUID(value: string = ''): string {
  let sanitizedValue = createRandomString()

  if (value) {
    sanitizedValue = value.split(' ').join('-')
  }

  return `${Date.now()}-${sanitizedValue}`
}

/**
 * Returns a random number within the given range.
 *
 * @param {number} range - Range of numbers
 * @returns {number} - Random number
 */
export function getRandomNum(range: number): number {
  return Math.floor(Math.random() * range)
}

/**
 * Returns the current timestamp in milliseconds.
 *
 * @returns {number} - Current timestamp
 */
export function getTimestamp(): number {
  return new Date().getTime()
}

/**
 * Returns the difference between two timestamps in minutes and seconds.
 *
 * @param {number} timestamp1 - First timestamp
 * @param {number} timestamp2 - Second timestamp
 * @returns {RoundTimeDuration} - Time difference
 */
export function logTimeDifference(
  timestamp1: number,
  timestamp2: number,
): { minutes: number; seconds: number } {
  const timeDifference = timestamp2 - timestamp1

  return {
    minutes: Math.floor(timeDifference / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  }
}

/**
 * Creates a time delay in milliseconds.
 * Returns a promise that resolves after a given time.
 *
 * @param {number} ms - Time in milliseconds
 * @returns {Promise<void>} - Resolved promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Creates a CSS variable string:
 *
 * E.g:a
 *
 * ```
 * If name="my-var" > `--my-var`.
 * If name="my-var" & value="123" > `--my-var: 123`.
 * If name="my-var" & wrapInVar=true > `var(--my-var)`.
 * If name="my-var" & value="123" & wrapInVar=true > `var(--my-var)`. // value is ignored.
 * ```
 *
 * @param {string} name - The name of the CSS variable.
 * @param {string} [value] - (optional) The value to assign to the CSS variable.
 * @param {boolean} [wrapInVar] - (optional) Wether to wrap the variable in a `var()` delcaration.
 * @returns {string} - The CSS variable string in the format `--name`, `--name: value` or `var(--name)`.
 */
export function createCssVar(name: string, value: string = '', wrapInVar: boolean = false): string {
  const varName = value ? `--${name}: ${value}` : `--${name}`

  return wrapInVar && !value ? `var(${varName})` : varName
}

/**
 * Capitalizes a string.
 *
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized String
 */
export function capitalize(str: string): string {
  if (!str) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Converts a round percentage into an array of star indicators.
 *
 * @param roundPercentage - The percentage score of the round (0-100)
 * @returns An array of 3 strings, either 'StarFull' or 'StarEmpty', representing achievement levels:
 *          - First star is always full
 *          - Second star is full if percentage > 50
 *          - Third star is full if percentage > 80
 */
export function getRoundStars(roundPercentage: number): ('StarFull' | 'StarEmpty')[] {
  return [
    'StarFull',
    roundPercentage > 50 ? 'StarFull' : 'StarEmpty',
    roundPercentage > 80 ? 'StarFull' : 'StarEmpty',
  ]
}

/**
 *  Renders a plural word based on the count.
 *
 * @param {string} word - The word to pluralize.
 * @param {number} count - The count to determine if the word should be pluralized.
 * @returns {string} - The pluralized word if count is greater than 1, otherwise the original word.
 */
export function renderPluralWord(word: string, count: number): string {
  return count > 1 || count === 0 ? `${word}s` : word
}

/**
 * Ensures that the given route starts with a single leading slash (`/`).
 * If the route is missing a leading slash, one is added.
 *
 * @param {string} route - The route string to sanitize.
 * @returns {string} The sanitized route starting with `/`.
 */
export function sanitizeRoute(route: string): string {
  return route.replace(/^\/?/, '/')
}

/**
 * Returns Today's date
 *
 * @param {boolean} onlyDate - Wether to return just the date (e.g. "2025-04-11"). Otherwise, returns the full ISO string with time.
 * @returns {string} Today's date.
 */
export function getToday(onlyDate: boolean = true): string {
  return onlyDate ? new Date().toISOString().split('T')[0] : new Date().toISOString()
}

/**
 * Formats a given date string into an object containing the day, month, and year.
 *
 * @param {string} dateString - The ISO 8601 date string to format (e.g., '2025-04-08T21:58:22.587Z').
 * @returns {{ day: string, month: string, year: number }} The formatted date with day, month (in lowercase), and year.
 */
export function formatDate(dateString: string): { day: string; month: string; year: number } {
  const date = new Date(dateString)
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  const day = String(date.getDate()).padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return { day, month, year }
}

/**
 * Enters fullscreen in the browser
 */
export function enterFullscreen() {
  if (isMobile()) {
    // document.documentElement.requestFullscreen().catch((err) => {
    //   console.error('Fullscreen request failed:', err)
    // })
  }
}
