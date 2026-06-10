/**
 * Telegram WebApp integration plugin (client-only).
 *
 * Telegram injects `window.Telegram.WebApp` into every page opened inside
 * its in-app browser — both regular shared links and official Mini Apps.
 *
 * What this plugin does:
 *  1. tg.ready()  — tells Telegram the page has loaded (hides loading spinner)
 *  2. tg.expand() — requests full-screen WebView height, removing Telegram's
 *                   own navigation bar from the viewport so our fixed
 *                   mobile-cta bar isn't overlapped by Telegram chrome
 *  3. --tg-vh     — sets a CSS custom property with the real stable viewport
 *                   height so elements using calc(var(--tg-vh) - Xpx) are
 *                   always accurate (100dvh can still be unreliable in WebView)
 */
export default defineNuxtPlugin(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tg = (window as any).Telegram?.WebApp
  if (!tg) return

  // 1. Signal the page is ready (removes Telegram's loader)
  tg.ready()

  // 2. Expand WebView to fill the full screen
  //    This removes Telegram's bottom navigation bar from the visible area
  //    and updates env(safe-area-inset-bottom) accordingly
  tg.expand()

  // 3. Mark document so CSS can apply Telegram-specific overrides
  //    e.g. .is-telegram .header { top: 0 } or .is-telegram .mobile-cta { ... }
  document.documentElement.classList.add('is-telegram')

  // 4. Sync --tg-vh CSS variable with the actual stable viewport height
  function updateVh(): void {
    // viewportStableHeight = height without keyboard; viewportHeight = current height
    const h: number = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight
    document.documentElement.style.setProperty('--tg-vh', `${h}px`)
  }

  updateVh()

  // Re-sync when Telegram resizes the WebView (keyboard open/close, expand, etc.)
  tg.onEvent('viewportChanged', updateVh)
})
