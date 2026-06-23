<script setup>
import { computed } from 'vue'
import serviceCockroachImage from '~/src/assets/images/service-cockroach.webp'
import serviceBedbugImage from '~/src/assets/images/service-bedbug.webp'
import serviceRatImage from '~/src/assets/images/service-rat.webp'
import serviceMoldImage from '~/src/assets/images/service-mold.webp'
import serviceDisinfectionImage from '~/src/assets/images/service-disinfection.webp'
import logoImage from '~/src/assets/images/logo.webp'
import AppHeader from '~/src/components/AppHeader.vue'
import AppBreadcrumb from '~/src/components/AppBreadcrumb.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import { company, siteMeta } from '~/src/data/company'
import { posts } from '~/src/data/posts'
const { trackGoal } = useMetrika()

const imageMap = {
  cockroach: serviceCockroachImage,
  bedbug: serviceBedbugImage,
  rat: serviceRatImage,
  mold: serviceMoldImage,
  disinfection: serviceDisinfectionImage,
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
function formatDate(iso) {
  return dateFormatter.format(new Date(iso))
}

const sortedPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished)),
)

const pageTitle = 'Блог о борьбе с вредителями и плесенью'
const pageDesc =
  'Полезные статьи о тараканах, клопах, крысах и плесени: как распознать заражение, что делать самостоятельно и когда нужна профессиональная обработка в Казани.'

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/blog`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const logoUrl = computed(() => new URL(logoImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${canonicalUrl.value}#blog`,
      name: `${pageTitle} | ${company.brand}`,
      description: pageDesc,
      url: canonicalUrl.value,
      inLanguage: siteMeta.language,
      publisher: {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${homeUrl.value}#business`,
        name: company.brand,
        legalName: company.legalName,
        telephone: company.phoneSchema,
        url: homeUrl.value,
        logo: { '@type': 'ImageObject', url: logoUrl.value, width: 200, height: 200 },
      },
      blogPost: sortedPosts.value.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDesc,
        url: `${siteOrigin.value}/blog/${post.slug}`,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        image: new URL(imageMap[post.imageKey], siteOrigin.value).toString(),
      })),
    },
  ],
}))

useServerSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: `${pageTitle} | ${company.brand}`,
  ogDescription: pageDesc,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
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
  <div class="blog-page">
    <AppHeader />

    <main>
      <AppBreadcrumb :items="[
        { label: 'Главная', to: '/' },
        { label: 'Блог', current: true },
      ]" />

      <section class="blog-hero">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Блог</p>
            <h1>{{ pageTitle }}</h1>
          </div>
          <p class="blog-hero__lead">{{ pageDesc }}</p>
        </div>
      </section>

      <section class="section section--compact section--bottom-space">
        <div class="container">
          <div class="blog-grid">
            <article v-for="post in sortedPosts" :key="post.slug" class="post-card">
              <NuxtLink :to="`/blog/${post.slug}`" class="post-card__media" :aria-label="post.title">
                <img
                  :src="imageMap[post.imageKey]"
                  :alt="post.imageAlt"
                  loading="lazy"
                  width="480"
                  height="260"
                />
                <span class="post-card__category">{{ post.category }}</span>
              </NuxtLink>
              <div class="post-card__body">
                <div class="post-card__meta">
                  <time :datetime="post.datePublished">{{ formatDate(post.datePublished) }}</time>
                  <span aria-hidden="true">·</span>
                  <span>{{ post.readingMinutes }} мин чтения</span>
                </div>
                <h2 class="post-card__title">
                  <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
                </h2>
                <p class="post-card__excerpt">{{ post.excerpt }}</p>
                <NuxtLink :to="`/blog/${post.slug}`" class="post-card__more">
                  Читать статью
                  <AppIcon name="arrow-right" :size="18" />
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="pest-footer">
      <div class="container pest-footer__inner">
        <span>© {{ new Date().getFullYear() }} {{ company.brand }} / {{ company.legalName }}</span>
        <a :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
        <NuxtLink to="/">На главную</NuxtLink>
      </div>
    </footer>

    <div class="mobile-cta" aria-label="Быстрые действия">
      <a class="mobile-cta__call" :href="company.phoneHref" @click="trackGoal('phone_click')">
        <span class="mobile-cta__call-icon">
          <AppIcon name="phone" :size="20" />
        </span>
        <span class="mobile-cta__call-label">
          <strong>Позвонить сейчас</strong>
          <small>{{ company.phoneDisplay }}</small>
        </span>
      </a>
      <a class="mobile-cta__form" href="/#contacts">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg, #f4f7fb);
}

/* ── Breadcrumb (matches pest page) ── */
.breadcrumb {
  background: #fff;
  border-bottom: 1px solid var(--slate-200);
}

.breadcrumb__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 0.8125rem;
  color: var(--slate-700);
  flex-wrap: wrap;
}

.breadcrumb__inner a {
  color: var(--slate-700);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb__inner a:hover {
  color: var(--green-500);
}

.breadcrumb__inner span[aria-current] {
  color: #24364d;
  font-weight: 600;
}

/* ── Hero ── */
.blog-hero {
  padding: 44px 0 8px;
}

.blog-hero__lead {
  max-width: 720px;
  margin: 0;
  color: #445568;
  font-size: 1.0625rem;
  line-height: 1.65;
}

/* ── Grid ── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.post-card:hover {
  border-color: rgba(97, 194, 68, 0.4);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-card__media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.post-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card__category {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(8, 21, 43, 0.78);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 100px;
  backdrop-filter: blur(4px);
}

.post-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 24px 24px;
  flex: 1;
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--slate-500);
}

.post-card__title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 800;
  line-height: 1.3;
}

.post-card__title a {
  color: var(--navy-900);
  text-decoration: none;
  transition: color 0.2s;
}

.post-card__title a:hover {
  color: var(--green-600, #3d9a23);
}

.post-card__excerpt {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #5c6b7d;
}

.post-card__more {
  margin-top: auto;
  padding-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--green-600, #3d9a23);
  text-decoration: none;
}

.post-card__more:hover {
  gap: 9px;
}

/* ── Footer (shared with pest page) ── */
.pest-footer {
  margin-top: auto;
  background: var(--navy-950);
  padding: 20px 0;
}

.pest-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8125rem;
  color: rgba(255 255 255 / 0.45);
}

.pest-footer__inner a {
  color: rgba(255 255 255 / 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.pest-footer__inner a:hover {
  color: #fff;
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }

  .blog-hero {
    padding-top: 32px;
  }
}
</style>
