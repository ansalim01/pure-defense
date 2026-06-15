/**
 * Deferred third-party analytics loader (client-only).
 *
 * Google Tag Manager (~110 KiB) and Yandex Metrika (~87 KiB) used to load
 * eagerly in <head>. On a throttled connection they competed with the hero
 * image for bandwidth and pushed LCP out badly.
 *
 * Strategy:
 *  1. Create the lightweight, network-free stubs immediately
 *     (`dataLayer` for GTM, `ym` for Metrika). Any pageview or goal fired
 *     before the heavy scripts arrive is QUEUED, so nothing is lost.
 *  2. Download the actual scripts only after the first user interaction, or
 *     after a short fallback timeout for visitors who never interact. By then
 *     the LCP has already painted, so analytics no longer steals bandwidth.
 *
 * The `<noscript>` pixel fallbacks stay in nuxt.config.ts for JS-disabled hits.
 */
const GTM_ID = 'GTM-PL5NVKCS'
const YM_ID = 109760856
const FALLBACK_DELAY = 3500
const TRIGGERS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const

export default defineNuxtPlugin(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any

  // 1. Immediate stubs — no network, so early hits are queued, not dropped.
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  w.ym =
    w.ym ||
    function (...args: unknown[]) {
      ;(w.ym.a = w.ym.a || []).push(args)
    }
  w.ym.l = Date.now()
  w.ym(YM_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: 'dataLayer',
  })

  // 2. Defer the heavy downloads off the critical path.
  let loaded = false
  let timer: ReturnType<typeof setTimeout>

  function inject(src: string): void {
    const s = document.createElement('script')
    s.async = true
    s.src = src
    document.head.appendChild(s)
  }

  function load(): void {
    if (loaded) return
    loaded = true
    TRIGGERS.forEach((e) => window.removeEventListener(e, load))
    clearTimeout(timer)

    inject(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)
    inject('https://mc.yandex.ru/metrika/tag.js')
  }

  TRIGGERS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }))
  timer = setTimeout(load, FALLBACK_DELAY)
})
