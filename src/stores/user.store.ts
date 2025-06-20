import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/Supabase.service'
import { TILE_DEFAULTS } from '@/configs/constants'
import { DEFAULT_LANGUAGE_CODE } from '@/configs/languages'
import type { User } from '@supabase/supabase-js'
import type { TileExpression, TileShape } from '@/components/app/tile/types'

interface UserProfile {
  id: string
  display_name: string
  email: string | undefined
  country: string
  created_at: string
  updated_at: string
  avatar: {
    expression: TileExpression
    shape: TileShape
    shape_color: string
    background_color: string
  }
  music: boolean
  sound: boolean
  language: string
}

/**
 * User store for managing user authentication and profile data.
 *
 * This store provides a centralized location for managing user state, including authentication status,
 * user profile data, and user settings. It also handles user sign-in, sign-up, and logout operations.
 *
 * The store uses Pinia for state management and provides computed properties for accessing user data.
 * It also includes functions for initializing the store, loading user profile data, and updating user settings.
 */
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const isAuthenticated = ref(false)

  const displayName = computed(
    () => profile.value?.display_name || user.value?.user_metadata?.display_name || '',
  )

  const email = computed(() => profile.value?.email || user.value?.email || '')

  const country = computed(() => profile.value?.country || user.value?.user_metadata?.country || '')

  const music = computed(() => profile.value?.music ?? false)

  const sound = computed(() => profile.value?.sound ?? false)

  const language = computed(() => profile.value?.language || DEFAULT_LANGUAGE_CODE)

  // Check if user's email is confirmed
  const isEmailConfirmed = computed(() => {
    return user.value?.email_confirmed_at !== null && user.value?.email_confirmed_at !== undefined
  })

  /**
   * Initializes the user store by getting the session and loading the user profile.
   */
  async function initialize() {
    isLoading.value = true

    try {
      const {
        data: { session },
        error,
      } = await supabase.getClient().auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        return
      }

      if (session?.user) {
        user.value = session.user
        isAuthenticated.value = true
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Error initializing user store:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Loads the user profile including the display name, email, country, created, updated at, music, sound, language and avatar.
   */
  async function loadUserProfile() {
    if (!user.value) {
      return
    }

    const { id, user_metadata, created_at, updated_at, email } = user.value
    const {
      country,
      display_name,
      avatar_expression,
      avatar_shape,
      avatar_color,
      avatar_background_color,
    } = user_metadata

    try {
      profile.value = {
        id,
        display_name,
        email,
        country,
        created_at,
        updated_at: updated_at || created_at,
        avatar: {
          expression: avatar_expression || TILE_DEFAULTS.expression,
          shape: avatar_shape || TILE_DEFAULTS.shape,
          shape_color: avatar_color || TILE_DEFAULTS.shapeColor,
          background_color: avatar_background_color || TILE_DEFAULTS.backgroundColor,
        },
        music: music.value,
        sound: sound.value,
        language: language.value,
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  /**
   * Signs in a user by email and password.
   */
  async function signIn(email: string, password: string, rememberMe: boolean = false) {
    isLoading.value = true

    try {
      const data = await supabase.signIn(email, password, rememberMe)
      user.value = data.user
      isAuthenticated.value = true
      await loadUserProfile()
      return data
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Signs up a new user.
   */
  async function signUp(payload: {
    display_name: string
    email: string
    password: string
    country: string
  }) {
    isLoading.value = true

    try {
      const { data, error } = await supabase.signUp(payload)
      if (error) {
        throw error
      }

      if (data.user) {
        user.value = data.user
        isAuthenticated.value = true
        await loadUserProfile()
      }

      return { data, error }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Signs out the user by clearing the user and profile data and setting the authentication state to false.
   */
  async function signOut() {
    isLoading.value = true

    try {
      await supabase.signOut()
      user.value = null
      profile.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes the user account.
   */
  async function deleteAccount() {
    isLoading.value = true

    try {
      await supabase.deleteAccount()
      user.value = null
      profile.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates the user's display name specifically
   * This uses a different approach than other metadata updates
   */
  async function updateDisplayName(displayName: string) {
    if (!user.value) return

    try {
      const { data, error } = await supabase.getClient().auth.updateUser({
        data: { display_name: displayName },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        user.value = data.user

        // Update local profile
        if (profile.value) {
          profile.value.display_name = displayName
        }
      }
    } catch (error) {
      console.error('Error updating display name:', error)
      throw error
    }
  }

  /**
   * Updates user settings in the auth user metadata
   *
   * @example
   * // Update multiple settings at once
   * await userStore.updateUserSettings({
   *   country: 'es',
   *   music: false,
   *   sound: true,
   *   language: 'es'
   * })
   */
  async function updateUserSettings(settings: {
    country?: string
    music?: boolean
    sound?: boolean
    language?: string
    avatar_shape?: string
    avatar_shape_color?: string
    avatar_background_color?: string
    avatar_expression?: string
  }) {
    if (!user.value) return

    try {
      const { data, error } = await supabase.getClient().auth.updateUser({
        data: settings,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        user.value = data.user

        if (profile.value) {
          if (settings.country !== undefined) {
            profile.value.country = settings.country
          }

          if (settings.music !== undefined) {
            profile.value.music = settings.music
          }

          if (settings.sound !== undefined) {
            profile.value.sound = settings.sound
          }

          if (settings.language !== undefined) {
            profile.value.language = settings.language
          }

          if (settings.avatar_shape !== undefined) {
            profile.value.avatar.shape = settings.avatar_shape as TileShape
          }

          if (settings.avatar_shape_color !== undefined) {
            profile.value.avatar.shape_color = settings.avatar_shape_color
          }

          if (settings.avatar_background_color !== undefined) {
            profile.value.avatar.background_color = settings.avatar_background_color
          }

          if (settings.avatar_expression !== undefined) {
            profile.value.avatar.expression = settings.avatar_expression as TileExpression
          }
        }
      }
    } catch (error) {
      console.error('Error updating user settings:', error)
      throw error
    }
  }

  /**
   * Sets up an auth state change listener to update the user store when the auth state changes.
   */
  function setupAuthListener() {
    supabase.getClient().auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        user.value = session.user
        isAuthenticated.value = true
        await loadUserProfile()
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        profile.value = null
        isAuthenticated.value = false
      }
    })
  }

  return {
    // State
    user,
    profile,
    isLoading,
    isAuthenticated,

    // Getters
    displayName,
    email,
    country,
    music,
    sound,
    language,
    isEmailConfirmed,

    // Actions
    initialize,
    loadUserProfile,
    signIn,
    signUp,
    signOut,
    deleteAccount,
    setupAuthListener,
    updateUserSettings,
    updateDisplayName,
  }
})
