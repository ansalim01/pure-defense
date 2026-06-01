export default defineNuxtConfig({
  ssr: true,
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
