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
 * Returns a random number within the given range.
 *
 * @param {number} rangeEnd - Range of numbers
 * @param {number} rangeStart - Range of numbers (optional)
 * @returns {number} - Random number
 */
export function getRandomNumber(rangeEnd: number, rangeStart: number = 0): number {
  return rangeStart
    ? Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart
    : Math.floor(Math.random() * rangeEnd)
}

/**
 * Returns a random boolean
 *
 * @returns A random boolean
 */
export function getRandomBoolean(): boolean {
  return Math.random() < 0.5
}

/**
 * Returns a random item from an array
 *
 * @param array - The array to get a random item from
 * @returns A random item from the array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[getRandomNumber(array.length)]
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
 * @param name - The name of the CSS variable.
 * @param {string} [value] - (optional) The value to assign to the CSS variable.
 * @param {boolean} [wrapInVar] - (optional) Wether to wrap the variable in a `var()` delcaration.
 * @returns {string} - The CSS variable string in the format `--name`, `--name: value` or `var(--name)`.
 */
export function createCssVar(name: string, value: string = '', wrapInVar: boolean = false): string {
  const varName = value ? `--${name}: ${value}` : `--${name}`
  return wrapInVar && !value ? `var(${varName})` : varName
}

/**
 * Checks if the app is running from the home screen (PWA mode)
 */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Enters fullscreen in the browser
 */
export function enterFullscreen() {
  if (isMobile()) {
    // Try to enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err: Error) => {
        console.error('Fullscreen request failed:', err)
      })
    }

    // Try to lock orientation to portrait on mobile
    if (screen.orientation && (screen.orientation as any).lock) {
      ;(screen.orientation as any).lock('portrait').catch((err: Error) => {
        console.error('Orientation lock failed:', err)
      })
    }

    document.body.classList.add('fullscreen-mode')
  }
}

/**
 * Exits fullscreen mode
 */
export function exitFullscreen() {
  if (isMobile()) {
    // Exit fullscreen mode
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err: Error) => {
        console.error('Exit fullscreen failed:', err)
      })
    }

    // Unlock orientation
    if (screen.orientation && (screen.orientation as any).unlock) {
      ;(screen.orientation as any).unlock()
    }

    document.body.classList.remove('fullscreen-mode')
  }
}

/**
 * Checks if the app is currently in fullscreen mode
 */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement
  )
}

/**
 * Extracts the row ID from a given tile ID.
 *
 * @param tileId - The input string containing the row ID.
 * @returns The extracted row ID.
 */
export function getTileRowId(tileId: string): string {
  return tileId.split('-')[0]
}

/**
 * Extracts the row index from a given row ID.
 *
 * @param rowId - The input string containing the row ID.
 * @returns The extracted row index.
 */
export function getRowIndex(rowId: string): number {
  return Number(rowId.split('row')[1])
}

/**
 * Checks if a league level can advance to the next level.
 * This determines if the current league is not the highest level available.
 *
 * @param currentLeagueLevel - The current league level to check
 * @param allLeagueLevels - Object containing all available league levels
 * @returns True if the league can advance to the next level, false if it's already at the highest level
 */
export function canAdvanceToNextLeague<T extends Record<string, any>>(
  currentLeagueLevel: keyof T,
  allLeagueLevels: T,
): boolean {
  const leagueKeys = Object.keys(allLeagueLevels) as (keyof T)[]
  const currentIndex = leagueKeys.indexOf(currentLeagueLevel)
  return currentIndex < leagueKeys.length - 1
}
