import { onKeyStroke } from '@vueuse/core'

export const useKeyboardShortCuts = () => {
  const onEnterKey = (callback: () => void) =>
        onKeyStroke('Enter', (e) => {
      e.preventDefault()
      callback()
    })

  return {
    onEnterKey,
  }
}
