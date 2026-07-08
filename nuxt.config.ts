const siteOrigin = (process.env.NUXT_PUBLIC_SITE_URL || 'https://dez-profi-kazan.ru').replace(/\/+$/, '')

function assetUrl(path: string) {
  return `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`
}

export default defineNuxtConfig({
  compatibilityDate: '2026-06-22',
  experimental: {
    // Vite 7 pre-transform race: #app-manifest not resolved on cold dev start (nuxt/nuxt#33606)
    appManifest: false,
  },
  ssr: true,
  routeRules: {
    '/': { prerender: true },
    '/vrediteli/**': { prerender: true },
    '/uslugi/**': { prerender: true },
    '/rayony/**': { prerender: true },
    '/blog/**': { prerender: true },
    '/rayony': { prerender: true },
    '/privacy': { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/vrediteli/tarakany',
        '/vrediteli/klopy',
        '/vrediteli/muravi',
        '/vrediteli/krysy',
        '/vrediteli/myshi',
        '/vrediteli/blohi',
        '/vrediteli/komary',
        '/vrediteli/osy',
        '/vrediteli/shershni',
        '/vrediteli/moli',
        '/vrediteli/pleseni',
        '/vrediteli/dezinfekciya',
        '/uslugi/kvartira',
        '/uslugi/chastnyj-dom',
        '/uslugi/kafe-restoran',
        '/uslugi/obshchezhitie',
        '/uslugi',
        '/rayony',
        '/rayony/vahitovskij',
        '/rayony/novo-savinovskij',
        '/rayony/privolzhskij',
        '/rayony/moskovskij',
        '/rayony/kirovskij',
        '/rayony/sovetskij',
        '/rayony/aviastroitelnyj',
        '/rayony/azino-gorki',
        '/rayony/derbyski',
        '/rayony/laishevo',
        '/rayony/zelenodolsk',
        '/rayony/vysokaya-gora',
        '/rayony/innopolis',
        '/rayony/pestretsy',
        '/blog',
        '/blog/kak-izbavitsya-ot-tarakanov',
        '/blog/priznaki-klopov-v-kvartire',
        '/blog/chem-opasna-chernaya-plesen',
        '/blog/kak-izbavitsya-ot-myshej-i-krys',
        '/blog/dezinfekciya-kvartiry-kogda-nuzhna',
        '/blog/chem-opasny-tarakany-dlya-zdorovya',
        '/blog/ukusy-klopov-kak-vyglyadyat',
        '/blog/kak-izbavitsya-ot-pleseni-v-vannoj',
        '/blog/dezinsekciya-dezinfekciya-deratizaciya-raznica',
        '/blog/kak-podgotovit-kvartiru-k-obrabotke',
        '/blog/mozhno-li-doma-posle-obrabotki',
        '/blog/chto-delat-posle-dezinsekcii',
        '/blog/kak-vybrat-sluzhbu-dezinsekcii',
        '/blog/kak-zashchitit-kvartiru-ot-povtornogo-zarazheniya',
        '/blog/skolko-deystvuet-obrabotka-ot-tarakanov',
        '/blog/ceny-dezinsekcii-kazan',
        '/blog/obrabotka-ot-klopov-kazan',
        '/privacy',
      ],
    },
  },
  css: [
    '@fontsource/manrope/cyrillic-400.css',
    '@fontsource/manrope/cyrillic-600.css',
    '@fontsource/manrope/cyrillic-700.css',
    '@fontsource/manrope/cyrillic-800.css',
    '~/src/style.css',
  ],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru-RU',
      },
      title: 'Чистая Защита',
      titleTemplate: '%s | Чистая Защита',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#08152b' },
        {
          name: 'description',
          content:
            'Чистая Защита — уничтожение тараканов, клопов, крыс и плесени в Казани. Выезд за 1 час, официально, с гарантией.',
        },
        { name: 'geo.region', content: 'RU-TA' },
        { name: 'geo.placename', content: 'Казань' },
        { name: 'geo.position', content: '55.796391;49.108891' },
        { name: 'ICBM', content: '55.796391, 49.108891' },
        { name: 'google-site-verification', content: 'Ux7vxWxPBG6g_tWtuMnQ4-BFH3N9_dMBJ2relSQeM3Q' },
        { name: 'yandex-verification', content: '60b9266cdbfedd61' },
      ],
      link: [
        // Яндекс Вебмастер: абсолютный href + type image/x-icon (см. help.yandex.ru/webmaster)
        { rel: 'icon', type: 'image/x-icon', href: assetUrl('/favicon.ico'), tagPriority: -100 },
        { rel: 'shortcut icon', type: 'image/x-icon', href: assetUrl('/favicon.ico'), tagPriority: -99 },
        // Растровый значок ≥120×120 — рекомендация Яндекса для сниппета в выдаче
        { rel: 'icon', type: 'image/png', sizes: '120x120', href: assetUrl('/favicon-120.png'), tagPriority: -98 },
        // Робот Яндекса также может взять apple-touch-icon
        { rel: 'apple-touch-icon', sizes: '180x180', href: assetUrl('/apple-touch-icon.png'), tagPriority: -97 },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: assetUrl('/favicon-16.png') },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: assetUrl('/favicon-32.png') },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: assetUrl('/favicon-192.png') },
        // Relative (same-origin) so the manifest loads without CORS on any host,
        // incl. localhost dev; in prod it still resolves to the site origin.
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      // GTM + Yandex Metrika are loaded lazily by plugins/analytics.client.ts
      // (after first interaction / idle) so they don't compete with the hero
      // image for bandwidth during the initial paint. The <noscript> pixels
      // below remain for JS-disabled visitors.
      noscript: [
        {
          innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PL5NVKCS" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          tagPosition: 'bodyOpen',
        },
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/109760856" style="position:absolute;left:-9999px;" alt=""></div>',
          tagPosition: 'bodyOpen',
        },
      ],
    },
  },
})
