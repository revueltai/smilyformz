export interface Database {
  public: {
    Tables: {
      game_sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          score: string | null
          duration: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          score?: string | null
          duration?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          score?: string | null
          duration?: string | null
        }
      }
      global_ranking: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          position: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          position?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          position?: number | null
        }
      }
    }
  }
}
