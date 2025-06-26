export interface Database {
  public: {
    Tables: {
      game_sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          score: number | null
          duration: string | null
          league_level: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          score?: number | null
          duration?: string | null
          league_level?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          score?: number | null
          duration?: string | null
          league_level?: string
        }
      }
      leagues_ranking: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          score?: number | null
          league_level: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          score?: number | null
          league_level?: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          score?: number | null
          league_level?: string
        }
      }
    }
  }
}
