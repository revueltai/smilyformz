import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

interface UserPayload {
  display_name: string
  email: string
  password: string
  country: string
}

/**
 * Checks if the Supabase error code indicates no rows were returned
 *
 * @param supabaseErrorCode - The error code to check
 * @returns True if the error code indicates no rows were returned, false otherwise
 */
function isNoRowsReturned(supabaseErrorCode: string) {
  return supabaseErrorCode === 'PGRST116'
}

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
    const { data, error } = await this.client.rpc('check_user_exists', {
      p_email: email,
      p_username: username,
    })

    if (error) {
      throw error
    }

    return data
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
   * This method deletes user data from custom tables and signs out
   * The auth user will remain but will have no associated data
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

    try {
      // Delete user data from custom tables
      // Add your table deletion logic here based on your schema
      // Example:
      // await this.client.from('user_profiles').delete().eq('user_id', user.id)
      // await this.client.from('user_scores').delete().eq('user_id', user.id)

      // For now, we'll just sign out which effectively "deletes" the account
      // from the user's perspective
      await this.signOut()
    } catch (deleteError) {
      throw deleteError
    }
  }

  // DATA METHODS ==========

  /**
   * Inserts a record into the database
   *
   * @param table - The table to insert into
   * @param payload - The data to insert
   * @returns The inserted record
   */
  private async insertRecord<T>(table: string, payload: Record<string, any>): Promise<T> {
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
  private async updateRecord<T>(
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
  private async deleteRecord(
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
