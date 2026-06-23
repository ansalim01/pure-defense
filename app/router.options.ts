import type { RouterConfig } from 'nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      const scrollToHash = () => {
        const el = document.querySelector(to.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      if (from.path === to.path) {
        scrollToHash()
        return false
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          scrollToHash()
          resolve({ top: 0 })
        }, 100)
      })
    }

    return { top: 0 }
  },
} satisfies RouterConfig
