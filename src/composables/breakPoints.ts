import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useBreakPoints = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const mobile = breakpoints.smaller('md')
  const desktop = breakpoints.greaterOrEqual('lg')
  const tablet = computed(() => !mobile.value && !desktop.value)

  return {
    mobile,
    desktop,
    tablet,
  }
}
