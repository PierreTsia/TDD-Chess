import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'
import type { GameStatus } from '~/core/types'

import supabase from '~/modules/supabase'
import type {
  ChatMessage,
  GameInsert,
  GameInviteData,
  GameInviteInsert,
  GameInviteUpdate,
  GameState,
  GameStateUpdate,
  GameUpdate,
  Json,
  OnlineGame,
  PlayerStatistics,
} from '~/modules/types/supabase'

interface PostChatPayload {
  gameId: string
  content: string
  userId: string
}

interface PlayerProperties {
  white_player: OnlinePlayer
  black_player: OnlinePlayer
}

export interface PresenceRef {
  presence_ref: string
  user: string
  online_at: string
}

export type SubscriptionCallBack<T extends { [key: string]: any }> = (
  p: RealtimePostgresChangesPayload<T>
) => void

export type PresenceSubscriptionCallBack = (onlineUsers: PresenceRef[]) => void

export type MultiplayerGameData = OnlineGame & PlayerProperties

export type MultiplayerGameInviteData = GameInviteData & PlayerProperties

export type MultiplayerGameState = GameState & {
  game: MultiplayerGameData
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
  subscribeToGameInvitesFeed(
    userId: string,
    callBacks: [
      SubscriptionCallBack<GameInviteData>,
      SubscriptionCallBack<OnlineGame>
    ]
  ): void
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

  subscribeToUsersPresence(
    userId: string,
    callback: PresenceSubscriptionCallBack
  ): void

  unsubscribeFromPlayersPresence(gameId: string, userId: string): void
  unsubscribeFromUsersPresence(): void
}

export interface AnalyticsService {
  getPlayerAnalytics(userId: string): Promise<PlayerStatistics>
}

export interface CrudService {
  getGame(gameId: string): Promise<MultiplayerGameData | null>
  getGames(userId: string): Promise<MultiplayerGameData[]>
  getUsers(): Promise<OnlinePlayer[]>
  getGameState(gameId: string): Promise<MultiplayerGameState | null>
  createGameState(gameId: string, board: Json): Promise<GameState>
  getChatMessages(gameId: string): Promise<GameChatMessage[]>
  postChatMessage(payload: PostChatPayload): Promise<void>
  createGame(payload: GameInsert): Promise<OnlineGame['id']>
  updateGame(payload: GameUpdate): Promise<OnlineGame>
  createGameInvite(
    payload: GameInviteInsert
  ): Promise<MultiplayerGameInviteData>
  updateGameInvite(
    inviteId: string,
    payload: GameStateUpdate
  ): Promise<GameInviteData>
  getGameInvites(userId: string): Promise<GameInviteData[]>
  getGameInviteById(id: string): Promise<MultiplayerGameInviteData | null>
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
  implements
    CrudService,
    MultiplayerService,
    SubscriptionService,
    AnalyticsService
{
  private POSTGRES_CHANGES = 'postgres_changes' as const
  private gamePlayersPresenceChannel!: RealtimeChannel
  private onlineUsersPresenceChannel!: RealtimeChannel

  async getPlayerAnalytics(userId: string): Promise<PlayerStatistics> {
    const { data, error } = await supabase
      .from('player_statistics')
      .select()
      .eq('player_id', userId)

    if (error) {
      throw new Error(error.message)
    }
    return data![0] as PlayerStatistics
  }

  async createGameInvite(
    payload: GameInviteInsert
  ): Promise<MultiplayerGameInviteData> {
    const { data, error } = await supabase.from('game_invites').insert(payload)
      .select(`
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
      `)

    if (error) {
      throw new Error(error.message)
    }
    return data![0] as MultiplayerGameInviteData
  }

  async updateGameInvite(
    inviteId: string,
    payload: GameInviteUpdate
  ): Promise<GameInviteData> {
    const { data, error } = await supabase
      .from('game_invites')
      .update(payload)
      .eq('id', inviteId)
      .select()

    if (error) {
      throw new Error(error.message)
    }
    return data![0] as GameInviteData
  }

  async getGameInvites(userId: string): Promise<MultiplayerGameInviteData[]> {
    const { data } = await supabase
      .from('game_invites')
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
      .is('game_id', null)
      .order('created_at', { ascending: false })

    if (data) {
      return data as MultiplayerGameInviteData[]
    }
    return []
  }

  async getGameInviteById(
    id: string
  ): Promise<MultiplayerGameInviteData | null> {
    const { data, error } = await supabase
      .from('game_invites')
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
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
    return data![0] as MultiplayerGameInviteData
  }

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

  async getGame(gameId: string): Promise<MultiplayerGameData | null> {
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
      return data[0] as MultiplayerGameData
    }
    return null
  }

  async updateGame(payload: GameUpdate): Promise<OnlineGame> {
    const { data, error } = await supabase
      .from('games')
      .update(payload)
      .eq('id', payload.id)
      .select()

    if (error) {
      throw new Error(error.message)
    }
    return data![0]
  }

  async getGames(userId: string): Promise<MultiplayerGameData[]> {
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
      .in('status', ['not_started', 'ongoing', 'check'])
      .order('created_at', { ascending: false })

    return (data ?? []) as MultiplayerGameData[]
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

  createPresenceChannel(
    gameId: string,
    userId: string,
    callback: PresenceSubscriptionCallBack
  ) {
    this.gamePlayersPresenceChannel = supabase
      .channel(`game-events:${gameId}`, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const state =
          this.gamePlayersPresenceChannel.presenceState<PresenceRef>()
        const onLineUsers = Object.values(state).map((p) => p[0])
        callback(onLineUsers)
      })
  }

  subscribeToPlayersPresence(
    gameId: string,
    userId: string,
    callback: PresenceSubscriptionCallBack
  ) {
    this.createPresenceChannel(gameId, userId, callback)

    this.gamePlayersPresenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.gamePlayersPresenceChannel.track({
          user: userId,
          online_at: new Date().toISOString(),
        })
        // eslint-disable-next-line no-console
        console.log(`Player ${userId} logged in : ${new Date().toISOString()}`)
      }
    })
  }

  createOnlineUsersPresenceChannel(callback: PresenceSubscriptionCallBack) {
    this.onlineUsersPresenceChannel = supabase
      .channel('online-users', {
        config: {
          presence: {
            key: 'online_at',
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const state =
          this.onlineUsersPresenceChannel.presenceState<PresenceRef>()
        const onLineUsers = Object.values(state).map((p) => p[0])
        callback(onLineUsers)
      })
  }

  subscribeToUsersPresence(
    userId: string,
    callback: PresenceSubscriptionCallBack
  ) {
    this.createOnlineUsersPresenceChannel(callback)
    this.onlineUsersPresenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.onlineUsersPresenceChannel.track({
          user: userId,
          online_at: new Date().toISOString(),
        })
        // eslint-disable-next-line no-console
        console.log(`User logged in : ${new Date().toISOString()}`)
      }
    })
  }

  unsubscribeFromPlayersPresence(gameId: string, userId: string) {
    this.gamePlayersPresenceChannel.unsubscribe().then(() => {
      // eslint-disable-next-line no-console
      console.log('Unsubscribed from presence channel', gameId, userId)
    })
  }

  unsubscribeFromUsersPresence() {
    this.onlineUsersPresenceChannel.unsubscribe().then(() => {
      // eslint-disable-next-line no-console
      console.log('Unsubscribed from presence channel')
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

  subscribeToGameInvitesFeed(
    userId: string,
    callBacks: [
      SubscriptionCallBack<GameInviteData>,
      SubscriptionCallBack<OnlineGame>
    ]
  ) {
    supabase
      .channel('schema-db-changes')
      .on(
        this.POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'game_invites',
        },
        (payload: RealtimePostgresChangesPayload<GameInviteData>) => {
          callBacks[0](payload)
        }
      )
      .on(
        this.POSTGRES_CHANGES,
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload: RealtimePostgresChangesPayload<OnlineGame>) => {
          callBacks[1](payload)
        }
      )

      .subscribe((payload) => {
        // eslint-disable-next-line no-console
        console.log('Subscribe to gameInvites:', payload)
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
