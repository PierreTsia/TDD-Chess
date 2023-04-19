import type { User as SBU } from '@supabase/supabase-js'
export type User = Database['public']['Tables']['users']['Row']
export type AuthUser = SBU

export type OnlineGame = Database['public']['Tables']['games']['Row']

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
