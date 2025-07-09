/**
 * Handles localStorage operations specifically for the app.
 * All keys are prefixed with 'sf-' to avoid conflicts with other apps.
 */
export function useLocalStorage() {
  const PREFIX = 'sf-'

  /**
   * Get a value from localStorage
   */
  function get(key: string): string | null {
    return localStorage.getItem(PREFIX + key)
  }

  /**
   * Set a value in localStorage
   */
  function set(key: string, value: string): void {
    localStorage.setItem(PREFIX + key, value)
  }

  /**
   * Remove a value from localStorage
   */
  function remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  }

  /**
   * Check if a key exists in localStorage
   */
  function has(key: string): boolean {
    return localStorage.getItem(PREFIX + key) !== null
  }

  /**
   * Gets a boolean value from localStorage
   */
  function getBoolean(key: string): boolean {
    return get(key) === 'true'
  }

  /**
   * Sets a boolean value in localStorage
   */
  function setBoolean(key: string, value: boolean): void {
    set(key, value.toString())
  }

  /**
   * Clear all localStorage items with the app prefix
   */
  function clear(): void {
    const keys = Object.keys(localStorage)

    keys.forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }

  return {
    get,
    set,
    remove,
    has,
    clear,
    getBoolean,
    setBoolean,
  }
}
