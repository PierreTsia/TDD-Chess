import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'
import type { GameStatus } from '~/core/types'

import supabase from '~/modules/supabase'
import type {
  ChatMessage,
  GameInsert,
  GameState,
  GameStateUpdate,
  Json,
  OnlineGame,
} from '~/modules/types/supabase'

interface PostChatPayload {
  gameId: string
  content: string
  userId: string
}

export interface PresenceRef {
  presence_ref: string
  user: string
  online_at: string
}

export type SubscriptionCallBack<T extends { [key: string]: any }> = (
  p: RealtimePostgresChangesPayload<T>
) => void

export type PresenceSubscriptionCallBack = (
  status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR',
  err?: Error | undefined
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

export interface SubscriptionService {
  subscribeToGamesFeed(callBack: SubscriptionCallBack<OnlineGame>): void
  subscribeToGameEvents(
    gameId: string,
    callbacks: [
      SubscriptionCallBack<ChatMessage>,
      SubscriptionCallBack<OnlineGame>,
      SubscriptionCallBack<GameState>
    ]
  ): void
  subscribeToPlayersPresence(
    gameId: string,
    userId: string,
    callback: PresenceSubscriptionCallBack
  ): void

  unsubscribeFromPlayersPresence(gameId: string, userId: string): void
}

export interface CrudService {
  getGame(gameId: string): Promise<MultiplayerGame | null>
  getGames(userId: string): Promise<MultiplayerGame[]>
  getUsers(): Promise<OnlinePlayer[]>
  getGameState(gameId: string): Promise<MultiplayerGameState | null>
  createGameState(gameId: string, board: Json): Promise<GameState>
  getChatMessages(gameId: string): Promise<GameChatMessage[]>
  postChatMessage(payload: PostChatPayload): Promise<void>
  createGame(payload: GameInsert): Promise<OnlineGame['id']>
}

export interface MultiplayerService {
  persistMove(
    gameId: string,
    board: GameStateUpdate,
    status: GameStatus,
    winnerId: string | null
  ): Promise<void>
}

export class SupabaseService
  implements CrudService, MultiplayerService, SubscriptionService
{
  private POSTGRES_CHANGES = 'postgres_changes' as const
  private presenceChannel!: RealtimeChannel

  async createGame(payload: GameInsert): Promise<OnlineGame['id']> {
    const { data, error } = await supabase
      .from('games')
      .insert(payload)
      .select()

    if (error) {
      throw new Error(error.message)
    }
    return data![0].id
  }

  async persistMove(
    gameId: string,
    payload: GameStateUpdate,
    status: GameStatus,
    winnerId: string | null
  ): Promise<void> {
    const { error } = await supabase
      .from('game_states')
      .update(payload)
      .eq('game_id', gameId)

    const { error: error2 } = await supabase
      .from('games')
      .update({ status, winner_id: winnerId })
      .eq('id', gameId)

    if (error) {
      throw new Error(error.message)
    } else if (error2) {
      throw new Error(error2.message)
    }
  }

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

  subscribeToGameEvents(
    gameId: string,
    callbacks: [
      SubscriptionCallBack<ChatMessage>,
      SubscriptionCallBack<OnlineGame>,
      SubscriptionCallBack<GameState>
    ]
  ) {
    supabase
      .channel('schema-db-changes')
      .on(
        this.POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        callbacks[0]
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        callbacks[1]
      )
      .on(
        this.POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'game_states',
          filter: `game_id=eq.${gameId}`,
        },
        callbacks[2]
      )
      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to Game Events:', payload)
      })
  }

  createPresenceChannel(gameId: string, userId: string, callback: any) {
    this.presenceChannel = supabase
      .channel(`game-events:${gameId}`, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.presenceChannel.presenceState<PresenceRef>()
        const onLineUsers = Object.values(state).map((p) => p[0])
        callback(onLineUsers)
      })
  }

  subscribeToPlayersPresence(gameId: string, userId: string, callback: any) {
    this.createPresenceChannel(gameId, userId, callback)

    this.presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.presenceChannel.track({
          user: userId,
          online_at: new Date().toISOString(),
        })
        // eslint-disable-next-line no-console
        console.log(`Player ${userId} logged in : ${new Date().toISOString()}`)
      }
    })
  }

  unsubscribeFromPlayersPresence(gameId: string, userId: string) {
    this.presenceChannel.unsubscribe().then(() => {
      // eslint-disable-next-line no-console
      console.log('Unsubscribed from presence channel', gameId, userId)
    })
  }

  subscribeToGamesFeed(
    callBack: (p: RealtimePostgresChangesPayload<OnlineGame>) => void
  ): void {
    supabase
      .channel('schema-db-changes')
      .on(
        this.POSTGRES_CHANGES,
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

  async getUsers(): Promise<OnlinePlayer[]> {
    const { data } = await supabase.from('users').select('*')
    return data as OnlinePlayer[]
  }
}
