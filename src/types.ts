import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void


export const PANELS = ['history', 'game', 'chat'] as const
export type Panel = (typeof PANELS)[number]
