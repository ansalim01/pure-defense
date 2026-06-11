export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    '/': { prerender: true },
    '/vrediteli/**': { prerender: true },
    '/privacy': { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/vrediteli/tarakany',
        '/vrediteli/klopy',
        '/vrediteli/krysy',
        '/vrediteli/pleseni',
        '/vrediteli/dezinfekciya',
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
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          // Google Tag Manager
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PL5NVKCS');`,
          type: 'text/javascript',
          tagPriority: 1,
        },
        {
          // Yandex.Metrika
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(109760856,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:'dataLayer'});`,
          type: 'text/javascript',
          tagPriority: 2,
        },
      ],
      noscript: [
        {
          // GTM noscript — immediately after <body>
          innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PL5NVKCS" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          tagPosition: 'bodyOpen',
        },
        {
          // Yandex.Metrika noscript
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/109760856" style="position:absolute;left:-9999px;" alt="" /></div>',
        },
      ],
    },
  },
})
