import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import supabase from '~/modules/supabase'
import type { ChatMessage, OnlineGame } from '~/modules/types/supabase'

export type MultiplayerGame = OnlineGame & {
  white_player: OnlinePlayer
  black_player: OnlinePlayer
}

export interface OnlinePlayer {
  username: string
  id: string
  email: string
}

export type GameChatMessage = ChatMessage & {
  user: OnlinePlayer
}

interface ApiService {
  getGame(gameId: string): Promise<MultiplayerGame | null>
  getGames(userId: string): Promise<MultiplayerGame[]>
  subscribeToOnlineGames(
    callBack: (p: RealtimePostgresChangesPayload<OnlineGame>) => void
  ): void

  subscribeToChatMessages(
    gameId: string,
    callBack: (p: RealtimePostgresChangesPayload<ChatMessage>) => void
  ): void

  getChatMessages(gameId: string): Promise<GameChatMessage[]>

  postChatMessage({
    gameId,
    content,
    userId,
  }: {
    gameId: string
    content: string
    userId: string
  }): Promise<void>
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
        console.log('Status is:', payload)
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
        console.log('Status is:', payload)
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
}
