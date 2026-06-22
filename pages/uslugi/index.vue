<script setup>
import { computed } from 'vue'
const { trackGoal } = useMetrika()
import AppHeader from '~/src/components/AppHeader.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import heroFallbackImage from '~/src/assets/images/hero-main.webp'
import { company, seoFaqs, siteMeta } from '~/src/data/company'
import { pests } from '~/src/data/pests'
import { segments } from '~/src/data/segments'

const pageTitle = 'Дезинсекция, дератизация и дезинфекция'
const metaTitle = 'Дезинсекция, дератизация и дезинфекция — услуги в Казани'
const metaDesc =
  'Что такое дезинсекция, дератизация и дезинфекция: чем отличаются, когда нужны и сколько стоят в Казани. Уничтожение насекомых, грызунов, плесени и патогенов — выезд за 1 час.'

const serviceTerms = [
  {
    term: 'Дезинсекция',
    definition:
      'Уничтожение и контроль насекомых: тараканов, клопов, муравьёв, блох, моли, ос и других. Проводится гелевыми приманками, аэрозолями или холодным туманом в зависимости от вида вредителя.',
    href: '/vrediteli/tarakany',
    label: 'Уничтожение насекомых',
  },
  {
    term: 'Дератизация',
    definition:
      'Борьба с грызунами — крысами и мышами. Включает расстановку приманочных станций, ловушек, блокировку путей проникновения и контрольный осмотр через 5–7 дней.',
    href: '/vrediteli/krysy',
    label: 'Уничтожение крыс и мышей',
  },
  {
    term: 'Дезинфекция',
    definition:
      'Уничтожение патогенных микроорганизмов — вирусов, бактерий, грибков. Нужна после болезни, затопления, ремонта или при подготовке помещения к сдаче.',
    href: '/vrediteli/dezinfekciya',
    label: 'Дезинфекция помещений',
  },
  {
    term: 'Удаление плесени',
    definition:
      'Антисептическая обработка стен, откосов, балконов и влажных зон. Счищаем споры, наносим фунгицид и защитный барьер для предотвращения рецидива.',
    href: '/vrediteli/pleseni',
    label: 'Удаление плесени',
  },
]

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/uslugi`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(heroFallbackImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Услуги', item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'WebPage',
      name: metaTitle,
      description: metaDesc,
      url: canonicalUrl.value,
    },
    {
      '@type': 'FAQPage',
      mainEntity: seoFaqs.slice(0, 4).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
}))

useServerSeoMeta({
  title: metaTitle,
  description: metaDesc,
  ogTitle: metaTitle,
  ogDescription: metaDesc,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt: siteMeta.ogImageAlt,
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle,
  twitterDescription: metaDesc,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  author: company.legalName,
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'ru-RU', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
  ],
  script: [
    { type: 'application/ld+json', children: computed(() => JSON.stringify(structuredData.value)) },
  ],
})
</script>

<template>
  <div class="hub-page">
    <AppHeader />

    <main>
      <nav class="breadcrumb" aria-label="Навигация по сайту">
        <div class="container breadcrumb__inner">
          <NuxtLink to="/">Главная</NuxtLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Услуги</span>
        </div>
      </nav>

      <section class="hub-hero">
        <div class="container">
          <h1 class="hub-hero__title">{{ pageTitle }} в Казани</h1>
          <p class="hub-hero__lead">
            Профессиональная санитарная обработка помещений: уничтожение насекомых, грызунов,
            плесени и патогенов. Работаем в квартирах, домах, кафе, общежитиях и на участках
            по Казани и области — выезд за 1 час, договор и гарантия до 1 года.
          </p>
          <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
            <AppIcon name="phone" :size="18" />
            Вызвать специалиста
          </a>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Термины</p>
            <h2>Чем отличаются дезинсекция, дератизация и дезинфекция</h2>
          </div>
          <div class="hub-terms">
            <article v-for="item in serviceTerms" :key="item.term" class="hub-term">
              <h3>{{ item.term }}</h3>
              <p>{{ item.definition }}</p>
              <NuxtLink :to="item.href">{{ item.label }} →</NuxtLink>
            </article>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>По видам вредителей</p>
            <h2>Уничтожение насекомых, грызунов и плесени</h2>
          </div>
          <div class="hub-grid">
            <NuxtLink v-for="pest in pests" :key="pest.slug" :to="`/vrediteli/${pest.slug}`" class="hub-card">
              <strong>{{ pest.nameNominative }}</strong>
              <span>{{ pest.price }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section section--compact section--bottom-space">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>По типу объекта</p>
            <h2>Обработка квартир, домов и коммерческих помещений</h2>
          </div>
          <div class="hub-grid">
            <NuxtLink v-for="segment in segments" :key="segment.slug" :to="`/uslugi/${segment.slug}`" class="hub-card hub-card--wide">
              <strong>{{ segment.navLabel }}</strong>
              <span>{{ segment.priceFrom }}</span>
            </NuxtLink>
          </div>
          <p class="hub-note">
            Работаем во всех районах Казани —
            <NuxtLink to="/rayony">смотреть карту выезда</NuxtLink>.
            Полезные статьи — в <NuxtLink to="/blog">блоге</NuxtLink>.
          </p>
        </div>
      </section>
    </main>

    <footer class="hub-footer">
      <div class="container hub-footer__inner">
        <span>© {{ new Date().getFullYear() }} {{ company.brand }}</span>
        <NuxtLink to="/">На главную</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hub-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg, #f4f7fb);
}

.breadcrumb {
  background: #fff;
  border-bottom: 1px solid var(--slate-200);
}

.breadcrumb__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  font-size: 0.8125rem;
  color: var(--slate-700);
}

.breadcrumb__inner a {
  color: var(--slate-700);
  text-decoration: none;
}

.hub-hero {
  background: var(--navy-950);
  padding: 52px 0;
}

.hub-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  max-width: 800px;
}

.hub-hero__lead {
  color: rgba(255 255 255 / 0.75);
  line-height: 1.7;
  max-width: 720px;
  margin: 0 0 24px;
}

.hub-terms {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.hub-term {
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.hub-term h3 {
  margin: 0 0 10px;
  font-size: 1.125rem;
  color: #24364d;
}

.hub-term p {
  margin: 0 0 14px;
  color: #445568;
  line-height: 1.65;
  font-size: 0.9375rem;
}

.hub-term a {
  color: var(--green-600);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.875rem;
}

.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.hub-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: #24364d;
}

.hub-card:hover {
  border-color: var(--green-500);
}

.hub-card span {
  color: var(--green-600);
  font-size: 0.875rem;
}

.hub-card--wide {
  grid-column: span 1;
}

.hub-note {
  margin: 24px 0 0;
  color: #445568;
  line-height: 1.6;
}

.hub-note a {
  color: var(--green-600);
  font-weight: 600;
  text-decoration: none;
}

.hub-footer {
  margin-top: auto;
  background: var(--navy-950);
  padding: 20px 0;
}

.hub-footer__inner {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: rgba(255 255 255 / 0.45);
}

.hub-footer__inner a {
  color: rgba(255 255 255 / 0.7);
  text-decoration: none;
}
</style>
