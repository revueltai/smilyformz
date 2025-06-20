import mitt from 'mitt'

/**
 * The bus service is used to emit and listen to events across the application.
 * Singleton instance of the mitt library.
 */
export const Bus = mitt<any>()
