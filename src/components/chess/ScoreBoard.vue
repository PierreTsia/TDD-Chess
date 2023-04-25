<script lang="ts" setup>
import type { Color, GameStatus, IPlayer, PieceType } from '~/core/types'
import type { PresenceRef } from '~/services/api'

const props = defineProps<{
  players: [IPlayer, IPlayer]
  materialScore: { white: number; black: number }
  winner: IPlayer | null
  status: GameStatus
  currentPlayer: IPlayer
  onlineUsers: PresenceRef[]
}>()



const presenceColor = (player: IPlayer) => {
  const isOnline = props.onlineUsers.find(({ user }) => user === player.id)
  return isOnline ? 'bg-green-500' : 'bg-yellow-500'
}

const opponentMaterialScore = (color: 'white' | 'black') => {
  const opponentColor = color === 'white' ? 'black' : 'white'
  return props.materialScore[opponentColor]
}

const { t } = useI18n()

const getIcon = (color: Color, pieceType?: PieceType) => {
  const pieceSlug = pieceType ? `i-tabler:chess-${pieceType}` : 'i-tabler:chess'
  return color === 'white' ? `${pieceSlug}-filled` : pieceSlug
}

const isNotOver = computed(
  () => !['not_started', 'checkmate', 'stalemate'].includes(props.status)
)

const getTagType = (status: string) => {
  switch (status) {
    case 'check':
      return 'error'
    case 'not_started':
      return 'warning'
    case 'ongoing':
      return 'success'
    default:
      return 'success'
  }
}
</script>

<template>
  <div class="w-[400px]">
    <o-card>
      <template #header>
        <div class="flex justify-center items-center w-full gap-4">
          <o-text v-for="p in players" :key="p.color" class="flex items-center">
            <span class="w-2 h-2 rounded-full mr-1" :class="presenceColor(p)" />
            <o-icon class="mr-1" :name="getIcon(p.color, 'king')" />
            {{ p?.name }}
          </o-text>
        </div>
      </template>
      <template #default>
        <ul
          class="w-full flex flex-wrap justify-center items-center px-10 gap-y-1">
          <li v-show="isNotOver" class="w-full flex start gap-x-6">
            <o-text size="sm" type="success">Playing :</o-text>
            <o-text size="sm" class="flex items-center">
              <o-icon class="mr-1 w-4" :name="getIcon(currentPlayer.color)" />{{
                currentPlayer?.name
              }}
            </o-text>
          </li>
          <li class="w-full flex justify-start gap-x-6">
            <o-text size="sm" type="success">Game Status :</o-text>
            <o-tag v-if="winner" type="secondary" size="xs" light>
              {{ winner?.name }} won !
            </o-tag>

            <o-tag v-else :type="getTagType(status)" size="xs" light>
              {{ t(`game_status.${status}`) }}
            </o-tag>
          </li>
          <li class="w-full flex justify-start gap-x-6">
            <o-text size="sm" type="success">Material Score :</o-text>
            <span
              v-for="p in players"
              :key="`materialScore-${p.color}`"
              class="flex justify-center items-center">
              <o-icon class="w-4" :name="getIcon(p.color)" />
              <o-text size="sm">{{ opponentMaterialScore(p.color) }}</o-text>
            </span>
          </li>
        </ul>
      </template>

      <template #actions>
        <div fbc un-children="flex items-center justify-center gap-2">
          <div gap-4>
            <div>
              <o-icon cursor-pointer name="i-carbon-star" />
            </div>
            <div>
              <o-icon cursor-pointer name="i-carbon-share" />
            </div>
            <div>
              <o-icon cursor-pointer name="i-carbon-face-wink-filled" />
            </div>
          </div>
        </div>
      </template>
    </o-card>
  </div>
</template>
