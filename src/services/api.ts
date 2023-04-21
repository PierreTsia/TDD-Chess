import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { GameStatus } from '~/core/types'

import supabase from '~/modules/supabase'
import type {
  ChatMessage,
  GameState,
  Json,
  OnlineGame,
} from '~/modules/types/supabase'

interface PostChatPayload {
  gameId: string
  content: string
  userId: string
}

type SubscriptionCallBack<T extends { [key: string]: any }> = (
  p: RealtimePostgresChangesPayload<T>
) => void

export type MultiplayerGame = OnlineGame & {
  white_player: OnlinePlayer
  black_player: OnlinePlayer
}

export type MultiplayerGameState = GameState & {
  game: MultiplayerGame
}

export interface OnlinePlayer {
  username: string
  id: string
  email: string
}

export type GameChatMessage = ChatMessage & {
  user: OnlinePlayer
}

export interface ApiService {
  getGame(gameId: string): Promise<MultiplayerGame | null>
  getGames(userId: string): Promise<MultiplayerGame[]>
  getGameState(gameId: string): Promise<MultiplayerGameState | null>

  createGameState(gameId: string, board: Json): Promise<GameState>

  getChatMessages(gameId: string): Promise<GameChatMessage[]>
  postChatMessage(payload: PostChatPayload): Promise<void>
  startOnlineGame(gameId: string, status: GameStatus): Promise<void>

  subscribeToOnlineGames(callBack: SubscriptionCallBack<OnlineGame>): void
  subscribeToChatMessages(
    gameId: string,
    callBack: SubscriptionCallBack<ChatMessage>
  ): void
  subscribeToGameStatus(
    gameId: string,
    callBack: SubscriptionCallBack<OnlineGame>
  ): void
}
export class SupabaseService implements ApiService {
  async getGame(gameId: string): Promise<MultiplayerGame | null> {
    const { data } = await supabase
      .from('games')
      .select(
        `
      *,
      white_player: white_player_id (
        username,
        id,
        email
      ),
      black_player: black_player_id (
        username,
        id,
        email

      )
    `
      )
      .eq('id', gameId)

    if (data) {
      return data[0] as MultiplayerGame
    }
    return null
  }

  async getGames(userId: string): Promise<MultiplayerGame[]> {
    const { data } = await supabase
      .from('games')
      .select(
        `
      *,
      white_player: white_player_id (
        username,
        id
      ),
      black_player: black_player_id (
        username,
        id

      )
    `
      )
      .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    return (data ?? []) as MultiplayerGame[]
  }

  async getGameState(gameId: string): Promise<MultiplayerGameState | null> {
    const { data, error } = await supabase
      .from('game_states')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })

    if (!data?.length || error) {
      return null
    }
    return data[0] as MultiplayerGameState
  }

  subscribeToOnlineGames(
    callBack: (p: RealtimePostgresChangesPayload<OnlineGame>) => void
  ): void {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload: RealtimePostgresChangesPayload<OnlineGame>) => {
          callBack(payload)
        }
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to Online Games:', payload)
      })
  }

  subscribeToChatMessages(
    gameId: string,
    callback: (p: RealtimePostgresChangesPayload<ChatMessage>) => void
  ): void {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          callback(payload)
        }
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to Chat Messages:', payload)
      })
  }

  async getUser(userId: string): Promise<OnlinePlayer | null> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return data as OnlinePlayer
  }

  async getChatMessages(gameId: string): Promise<GameChatMessage[]> {
    const { data } = await supabase
      .from('chat_messages')
      .select(
        `
      *,
      user: user_id (
        username,
        id,
        email
      )
    `
      )
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })

    return (data as GameChatMessage[]) ?? []
  }

  async postChatMessage({
    gameId,
    content,
    userId,
  }: {
    gameId: string
    content: string
    userId: string
  }): Promise<void> {
    await supabase.from('chat_messages').insert([
      {
        user_id: userId,
        content,
        game_id: gameId,
      },
    ])
  }

  async createGameState(gameId: string, board: Json): Promise<GameState> {
    const { error } = await supabase.from('game_states').insert([
      {
        game_id: gameId,
        board,
        captured_pieces: [],
        move_history: [],
      },
    ])
    if (error) {
      throw new Error('Could not create game state')
    }
    const { data } = await supabase
      .from('game_states')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .single()

    return data as GameState
  }

  subscribeToGameStatus(
    gameId: string,
    callBack: SubscriptionCallBack<OnlineGame>
  ): void {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload: RealtimePostgresChangesPayload<OnlineGame>) => {
          callBack(payload)
        }
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to Game Status:', payload)
      })
  }

  async startOnlineGame(gameId: string, status: GameStatus): Promise<void> {
    const { error } = await supabase
      .from('games')
      .update({ status })
      .eq('id', gameId)

    if (error) {
      throw new Error('Could not start game')
    }
  }
}
