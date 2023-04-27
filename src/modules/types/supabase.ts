import type { User as SBU } from '@supabase/supabase-js'
export type User = Database['public']['Tables']['users']['Row']
export type AuthUser = SBU

export type OnlineGame = Database['public']['Tables']['games']['Row']

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

export type GameState = Database['public']['Tables']['game_states']['Row']

export type GameUpdate = Database['public']['Tables']['games']['Update']

export type GameStateUpdate =
  Database['public']['Tables']['game_states']['Update']

export type GameInsert = Database['public']['Tables']['games']['Insert']

export type GameInviteInsert =
  Database['public']['Tables']['game_invites']['Insert']

export type GameInviteData = Database['public']['Tables']['game_invites']['Row']

export type GameInviteUpdate =
  Database['public']['Tables']['game_invites']['Update']

export type PlayerStatistics =
  Database['public']['Views']['player_statistics']['Row']

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          game_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          game_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          game_id?: string | null
          id?: string
          user_id?: string | null
        }
      }
      game_invites: {
        Row: {
          black_player_id: string | null
          created_at: string
          game_id: string | null
          host_id: string | null
          id: string
          valid_until: string
          white_player_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          created_at?: string
          game_id?: string | null
          host_id?: string | null
          id?: string
          valid_until?: string
          white_player_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          created_at?: string
          game_id?: string | null
          host_id?: string | null
          id?: string
          valid_until?: string
          white_player_id?: string | null
        }
      }
      game_states: {
        Row: {
          board: Json
          captured_pieces: Json
          created_at: string
          current_player_id: string | null
          game_id: string | null
          id: string
          move_history: Json
          updated_at: string
        }
        Insert: {
          board: Json
          captured_pieces: Json
          created_at?: string
          current_player_id?: string | null
          game_id?: string | null
          id?: string
          move_history: Json
          updated_at?: string
        }
        Update: {
          board?: Json
          captured_pieces?: Json
          created_at?: string
          current_player_id?: string | null
          game_id?: string | null
          id?: string
          move_history?: Json
          updated_at?: string
        }
      }
      games: {
        Row: {
          black_player_id: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
          white_player_id: string | null
          winner_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          white_player_id?: string | null
          winner_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          white_player_id?: string | null
          winner_id?: string | null
        }
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          username?: string
        }
      }
    }
    Views: {
      player_statistics: {
        Row: {
          losses: number | null
          player_id: string | null
          total_games: number | null
          wins: number | null
          wins_as_black: number | null
          wins_as_white: number | null
        }
      }
    }

    Functions: {
      player_analytics: {
        Args: {
          user_id: string
        }
        Returns: {
          player_id: string
          total_games: number
          wins: number
          losses: number
          wins_as_white: number
          wins_as_black: number
          most_frequent_opponent_id: string
          most_frequent_opponent_username: string
          most_frequent_opponent_email: string
          most_frequent_opponent_created_at: string
          most_frequent_opponent_updated_at: string
        }[]
      }
    }

    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
