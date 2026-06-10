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
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(109760856,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:'dataLayer'});`,
          type: 'text/javascript',
          tagPriority: 1,
        },
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/109760856" style="position:absolute;left:-9999px;" alt="" /></div>',
        },
      ],
    },
  },
})
