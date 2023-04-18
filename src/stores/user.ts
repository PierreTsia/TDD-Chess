import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import type { AuthUser, User } from '~/modules/types/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const loginFromEmail = async (
    email: string,
    password: string
  ): Promise<AuthUser | null> => {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return data?.user ?? null
  }

  const fetchUserData = async (userId: string): Promise<User | null> => {
    const { data } = await supabase.from('users').select('*').eq('id', userId)

    if (!data || !data[0]) {
      return null
    }
    return data[0]
  }

  const getUserFromId = async (userId: string) => {
    user.value = await fetchUserData(userId)
  }

  const fetchUser = async (email: string, password: string) => {
    const auth = await loginFromEmail(email, password)
    user.value = await fetchUserData(auth?.id ?? '')
  }

  return {
    fetchUser,
    getUserFromId,
    fetchUserData,
    loginFromEmail,
    user,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
