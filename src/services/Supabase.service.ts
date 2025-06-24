import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { DEFAULT_LEAGUE_LEVEL, TILE_DEFAULTS } from '@/configs/constants'
import { DEFAULT_LANGUAGE_CODE } from '@/configs/languages'

interface UserPayload {
  display_name: string
  email: string
  password: string
  country: string
}

// Type-safe database function names
export const DATABASE_FUNCTIONS = {
  CHECK_USER_EXISTS: 'check_user_exists',
  DELETE_USER_DATA: 'delete_user_data',
  IS_ACCOUNT_DELETED: 'is_account_deleted',
  VALIDATE_ACCOUNT_STATUS: 'validate_account_status',
} as const

export type DatabaseFunctionName = (typeof DATABASE_FUNCTIONS)[keyof typeof DATABASE_FUNCTIONS]

/**
 * The Supabase service class for interacting with the database
 */
export class SupabaseService {
  private static instance: SupabaseService
  private client: SupabaseClient<Database>

  /**
   * Creates a new instance of the SupabaseService
   */
  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('MissingSupabaseConfig')
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey)
  }

  /**
   * Returns the singleton instance of the SupabaseService
   *
   * @returns The singleton instance of the SupabaseService
   */
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  /**
   * Returns the Supabase client
   *
   * @returns The Supabase client
   */
  public getClient(): SupabaseClient<Database> {
    return this.client
  }

  /**
   * Calls RPC (PostgreSQL) database functions with standardized error handling
   *
   * @param functionName - The name of the RPC (PostgreSQL) database function to call
   * @param params - The parameters to pass to the function
   * @returns The function result data
   */
  public async callDatabaseFunction<T = any>(
    functionName: DatabaseFunctionName,
    params?: Record<string, any>,
  ): Promise<T> {
    const { data, error } = await this.client.rpc(functionName, params)

    if (error) {
      throw new Error(`Failed to call database function: ${error.message}`)
    }

    return data
  }

  // AUTHENTICATION METHODS ==========

  /**
   * Checks if the user account already exists in the database by email or username
   *
   * @param email - The email of the user
   * @param username - The username of the user
   * @returns True if the user exists, false otherwise
   */
  async checkUserExists(
    email: string | null = null,
    username: string | null = null,
  ): Promise<boolean> {
    return this.callDatabaseFunction<boolean>(DATABASE_FUNCTIONS.CHECK_USER_EXISTS, {
      p_email: email,
      p_username: username,
    })
  }

  /**
   * Validates account status before login attempt
   *
   * @param email - The email to validate
   * @throws Error if account is deleted or validation fails
   */
  async validateAccountBeforeLogin(email: string): Promise<void> {
    const validation = await this.callDatabaseFunction<{
      valid: boolean
      error?: string
      message: string
    }>(DATABASE_FUNCTIONS.VALIDATE_ACCOUNT_STATUS, {
      p_email: email,
    })

    if (!validation.valid) {
      throw new Error(validation.error || 'Account validation failed')
    }
  }

  /**
   * Checks if the email is unique
   *
   * @param email - The email to check
   * @returns True if the email is unique, false otherwise
   */
  async isEmailUnique(email: string): Promise<boolean> {
    try {
      const exists = await this.checkUserExists(email, null)
      return !exists
    } catch (error) {
      console.error('ErrorEmailUniqueness', error)
      return false
    }
  }

  /**
   * Checks if the username is unique
   *
   * @param username - The username to check
   * @returns True if the username is unique, false otherwise
   */
  async isUsernameUnique(username: string): Promise<boolean> {
    try {
      const exists = await this.checkUserExists(null, username)
      return !exists
    } catch (error) {
      console.error('ErrorUsernameUniqueness', error)
      return false
    }
  }

  /**
   * Signs up a new user
   *
   * @param payload - The user payload
   * @returns The user data
   */
  async signUp(payload: UserPayload) {
    const { email, password, display_name, country } = payload

    if (!email || !password) {
      throw new Error('MissingEmailOrPassword')
    }

    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name,
          country,
          language: DEFAULT_LANGUAGE_CODE,
          league_level: DEFAULT_LEAGUE_LEVEL,
          music: false,
          sound: false,
          avatar_shape: TILE_DEFAULTS.shape,
          avatar_color: TILE_DEFAULTS.shapeColor,
          avatar_background_color: TILE_DEFAULTS.backgroundColor,
          avatar_expression: TILE_DEFAULTS.expression,
        },
      },
    })

    if (error) {
      throw error
    }

    return { data, error }
  }

  /**
   * Signs in a user by email and password
   *
   * @param email - The email of the user
   * @param password - The password of the user
   * @param rememberMe - Whether to remember the user
   * @returns The user data
   */
  async signIn(email: string, password: string, rememberMe: boolean = false) {
    // Validate account status before attempting login
    await this.validateAccountBeforeLogin(email)

    // Proceed with normal Supabase authentication
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    if (rememberMe) {
      await this.client.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    }

    return data
  }

  /**
   * Signs out a user
   */
  async signOut() {
    const { error } = await this.client.auth.signOut()

    if (error) {
      throw error
    }
  }

  /**
   * Deletes the current user account
   * Note: This is a destructive operation and cannot be undone
   *
   * This method calls a PostgreSQL function to delete user data and mark the account as deleted,
   * then signs out the user.
   */
  async deleteAccount() {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser()

    if (error) {
      throw error
    }

    if (!user) {
      throw new Error('NoUserFound')
    }

    // Call PostgreSQL function to delete user data and mark account as deleted
    const data = await this.callDatabaseFunction<{
      success: boolean
      message: string
      deleted_game_sessions: number
      deleted_at: string
      error?: string
    }>(DATABASE_FUNCTIONS.DELETE_USER_DATA, {
      p_user_id: user.id,
    })

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to delete user data')
    }

    console.log(
      'User data deleted successfully:',
      data?.message,
      'Deleted sessions:',
      data?.deleted_game_sessions,
    )

    // Sign out the user
    await this.signOut()
  }

  // DATA METHODS ==========

  /**
   * Inserts a record into the database
   *
   * @param table - The table to insert into
   * @param payload - The data to insert
   * @returns The inserted record
   */
  public async insertRecord<T>(table: string, payload: Record<string, any>): Promise<T> {
    const { data, error } = await this.client.from(table).insert(payload).select().single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error(`FailedInsert_${table}`)
    }

    return data as T
  }

  /**
   * Updates a record in the database
   *
   * @param table - The table to update
   * @param id - The id of the record to update
   * @param payload - The data to update
   * @param idField - The field to use as the id
   * @returns The updated record
   */
  public async updateRecord<T>(
    table: string,
    id: string,
    payload: Record<string, any>,
    idField: string = 'id',
  ): Promise<T> {
    const { data, error } = await this.client
      .from(table)
      .update(payload)
      .eq(idField, id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error(`FailedUpdate_${table}`)
    }

    return data as T
  }

  /**
   * Deletes a record from the database
   *
   * @param table - The table to delete from
   * @param id - The id of the record to delete
   * @param options - Optional parameters
   * @returns True if the record was deleted, false otherwise
   */
  public async deleteRecord(
    table: string,
    id: string,
    options?: { fkField?: string },
  ): Promise<boolean> {
    const query = this.client.from(table).delete()

    if (options?.fkField) {
      query.eq(options.fkField, id)
    } else {
      query.eq('id', id)
    }

    const { error } = await query

    if (error) {
      return false
    }

    return true
  }
}

export const supabase = SupabaseService.getInstance()
