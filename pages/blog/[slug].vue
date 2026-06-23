<script setup>
import { computed, ref } from 'vue'
import serviceCockroachImage from '~/src/assets/images/service-cockroach.webp'
import serviceBedbugImage from '~/src/assets/images/service-bedbug.webp'
import serviceRatImage from '~/src/assets/images/service-rat.webp'
import serviceMoldImage from '~/src/assets/images/service-mold.webp'
import serviceDisinfectionImage from '~/src/assets/images/service-disinfection.webp'
import logoImage from '~/src/assets/images/logo.webp'
import AppHeader from '~/src/components/AppHeader.vue'
import AppBreadcrumb from '~/src/components/AppBreadcrumb.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import BlogContent from '~/src/components/BlogContent.vue'
import { company, siteMeta } from '~/src/data/company'
import { findPost, posts } from '~/src/data/posts'
const { trackGoal } = useMetrika()

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const post = findPost(slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const imageMap = {
  cockroach: serviceCockroachImage,
  bedbug: serviceBedbugImage,
  rat: serviceRatImage,
  mold: serviceMoldImage,
  disinfection: serviceDisinfectionImage,
}
const coverImage = imageMap[post.imageKey]

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
function formatDate(iso) {
  return dateFormatter.format(new Date(iso))
}

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/blog/${post.slug}`)
const blogUrl = computed(() => `${siteOrigin.value}/blog`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const coverUrl = computed(() => new URL(coverImage, siteOrigin.value).toString())
const logoUrl = computed(() => new URL(logoImage, siteOrigin.value).toString())

const otherPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: blogUrl.value },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDesc,
      image: coverUrl.value,
      url: canonicalUrl.value,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      inLanguage: siteMeta.language,
      articleSection: post.category,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl.value },
      author: {
        '@type': 'Organization',
        name: company.brand,
        url: homeUrl.value,
      },
      publisher: {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${homeUrl.value}#business`,
        name: company.brand,
        legalName: company.legalName,
        telephone: company.phoneSchema,
        url: homeUrl.value,
        logo: { '@type': 'ImageObject', url: logoUrl.value, width: 200, height: 200 },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
}))

useServerSeoMeta({
  title: post.metaTitle,
  description: post.metaDesc,
  ogTitle: post.metaTitle,
  ogDescription: post.metaDesc,
  ogType: 'article',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: coverUrl,
  ogImageAlt: post.imageAlt,
  articlePublishedTime: post.datePublished,
  articleModifiedTime: post.dateModified,
  articleSection: post.category,
  articleAuthor: [company.brand],
  twitterCard: 'summary_large_image',
  twitterTitle: post.metaTitle,
  twitterDescription: post.metaDesc,
  twitterImage: coverUrl,
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

const openedFaq = ref(0)
function toggleFaq(index) {
  openedFaq.value = openedFaq.value === index ? -1 : index
}

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Блог', to: '/blog' },
  { label: post.category, current: true },
])
</script>

<template>
  <div class="blog-post-page">
    <AppHeader />

    <main>
      <AppBreadcrumb :items="breadcrumbItems" />

      <article class="post">
        <header class="post__header">
          <div class="container post__header-inner">
            <NuxtLink to="/blog" class="post__category">{{ post.category }}</NuxtLink>
            <h1 class="post__title">{{ post.title }}</h1>
            <p class="post__excerpt">{{ post.excerpt }}</p>
            <div class="post__meta">
              <span class="post__meta-item">
                <AppIcon name="document" :size="16" />
                Обновлено {{ formatDate(post.dateModified) }}
              </span>
              <span class="post__meta-item">
                <AppIcon name="clock" :size="16" />
                {{ post.readingMinutes }} мин чтения
              </span>
            </div>
          </div>
        </header>

        <div class="container post__media">
          <img
            :src="coverImage"
            :alt="post.imageAlt"
            loading="eager"
            fetchpriority="high"
            width="900"
            height="480"
          />
        </div>

        <div class="container post__layout">
          <div class="post__main">
            <aside class="post__takeaways" aria-label="Коротко о главном">
              <p class="post__takeaways-title">
                <AppIcon name="shield-check" :size="18" />
                Коротко
              </p>
              <ul>
                <li v-for="item in post.keyTakeaways" :key="item">{{ item }}</li>
              </ul>
            </aside>

            <aside class="post__local" aria-label="Услуги в Казани">
              <p class="post__local-eyebrow">Казань и область</p>
              <h2 class="post__local-title">Нужна профессиональная обработка?</h2>
              <p class="post__local-text">
                «{{ company.brand }}» выезжает по всем районам Казани и пригороду — выезд за 1 час,
                договор и гарантия до 1 года. Если самостоятельные методы не помогли, закажите
                <NuxtLink :to="`/vrediteli/${post.relatedService.slug}`">{{ post.relatedService.label.toLowerCase() }}</NuxtLink>
                или посмотрите <NuxtLink to="/uslugi">все услуги</NuxtLink>.
              </p>
              <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
                <AppIcon name="phone" :size="18" />
                Вызвать в Казани
              </a>
            </aside>

            <BlogContent :blocks="post.body" />

            <section class="post__faq" aria-label="Частые вопросы">
              <h2>Частые вопросы</h2>
              <div class="faq-list">
                <article
                  v-for="(faq, index) in post.faqs"
                  :key="faq.question"
                  class="faq-item"
                  :class="{ 'faq-item--open': openedFaq === index }"
                >
                  <button
                    type="button"
                    class="faq-item__button"
                    :aria-expanded="openedFaq === index"
                    @click="toggleFaq(index)"
                  >
                    <span class="faq-item__label">
                      <AppIcon name="help" :size="18" />
                      {{ faq.question }}
                    </span>
                    <AppIcon name="chevron" :size="18" />
                  </button>
                  <p v-if="openedFaq === index" class="faq-item__answer">{{ faq.answer }}</p>
                </article>
              </div>
            </section>
          </div>

          <aside class="post__sidebar">
            <div class="post__cta">
              <p class="post__cta-eyebrow">Нужна помощь?</p>
              <h2 class="post__cta-title">{{ post.relatedService.label }}</h2>
              <p class="post__cta-desc">Выезд за 1 час · официально, с договором · гарантия до 1 года.</p>
              <a class="button button--primary button--block" :href="company.phoneHref" @click="trackGoal('phone_click')">
                <AppIcon name="phone" :size="18" />
                {{ company.phoneDisplay }}
              </a>
              <NuxtLink class="button button--secondary button--block" :to="`/vrediteli/${post.relatedService.slug}`">
                Подробнее об услуге
              </NuxtLink>
              <span class="post__cta-hours">{{ company.workingHours }}</span>
            </div>
          </aside>
        </div>
      </article>

      <section v-if="otherPosts.length" class="section section--compact section--bottom-space">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Читайте также</p>
            <h2>Другие статьи</h2>
          </div>
          <div class="related-posts">
            <NuxtLink
              v-for="other in otherPosts"
              :key="other.slug"
              :to="`/blog/${other.slug}`"
              class="related-post"
            >
              <img :src="imageMap[other.imageKey]" :alt="other.imageAlt" loading="lazy" width="200" height="130" />
              <div class="related-post__body">
                <span class="related-post__category">{{ other.category }}</span>
                <strong>{{ other.title }}</strong>
                <span class="related-post__more">Читать <AppIcon name="arrow-right" :size="16" /></span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="pest-footer">
      <div class="container pest-footer__inner">
        <span>© {{ new Date().getFullYear() }} {{ company.brand }} / {{ company.legalName }}</span>
        <a :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
        <NuxtLink to="/blog">Все статьи</NuxtLink>
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
      <NuxtLink class="mobile-cta__form" :to="`/vrediteli/${post.relatedService.slug}`">
        <AppIcon name="shield" :size="15" />
        Услуга
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg, #f4f7fb);
}

/* ── Breadcrumb ── */
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

/* ── Header ── */
.post__header {
  padding: 40px 0 28px;
}

.post__header-inner {
  max-width: 820px;
}

.post__category {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--green-600, #3d9a23);
  text-decoration: none;
}

.post__title {
  margin: 0 0 16px;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.18;
  color: var(--navy-900);
}

.post__excerpt {
  margin: 0 0 20px;
  font-size: 1.1875rem;
  line-height: 1.6;
  color: #445568;
}

.post__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.post__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.875rem;
  color: var(--slate-700);
}

.post__meta-item svg {
  color: var(--green-500);
}

/* ── Cover ── */
.post__media {
  margin-bottom: 8px;
}

.post__media img {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: var(--radius-xl);
  display: block;
}

/* ── Layout ── */
.post__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 48px;
  align-items: start;
  padding-top: 36px;
  padding-bottom: 40px;
}

.post__main {
  min-width: 0;
  max-width: 760px;
}

/* ── Takeaways ── */
.post__takeaways {
  background: var(--navy-950);
  border-radius: var(--radius-lg);
  padding: 26px 30px;
  margin-bottom: 36px;
}

.post__takeaways-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--green-400);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post__takeaways ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post__takeaways li {
  position: relative;
  padding-left: 26px;
  color: rgba(255 255 255 / 0.86);
  font-size: 0.96rem;
  line-height: 1.55;
}

.post__takeaways li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green-500);
}

.post__local {
  background: #fff;
  border: 1px solid var(--slate-200);
  border-left: 4px solid var(--green-500);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  margin-bottom: 36px;
}

.post__local-eyebrow {
  margin: 0 0 6px;
  color: var(--green-600);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post__local-title {
  margin: 0 0 10px;
  font-size: 1.25rem;
  color: #24364d;
}

.post__local-text {
  margin: 0 0 18px;
  color: #445568;
  line-height: 1.65;
  font-size: 0.96rem;
}

.post__local-text a {
  color: var(--green-600);
  font-weight: 600;
  text-decoration: none;
}

/* ── FAQ ── */
.post__faq {
  margin-top: 48px;
}

.post__faq h2 {
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  font-weight: 800;
  color: var(--navy-900);
  margin: 0 0 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item--open {
  border-color: rgba(97, 194, 68, 0.45);
}

.faq-item__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 22px;
  background: transparent;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy-900);
}

.faq-item__label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.faq-item__label svg {
  color: var(--green-500);
  flex-shrink: 0;
}

.faq-item--open .faq-item__button :deep(svg:last-child) {
  transform: rotate(180deg);
}

.faq-item__answer {
  margin: 0;
  padding: 0 22px 20px 50px;
  color: #445568;
  line-height: 1.65;
  font-size: 0.96rem;
}

/* ── Sidebar CTA ── */
.post__sidebar {
  position: sticky;
  top: 90px;
}

.post__cta {
  background: var(--navy-950);
  border-radius: var(--radius-lg);
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post__cta-eyebrow {
  margin: 0;
  color: var(--green-400);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.post__cta-title {
  margin: 0;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.3;
}

.post__cta-desc {
  margin: 0 0 4px;
  color: rgba(255 255 255 / 0.65);
  font-size: 0.9rem;
  line-height: 1.55;
}

.post__cta-hours {
  text-align: center;
  color: rgba(255 255 255 / 0.45);
  font-size: 0.8rem;
}

/* ── Related posts ── */
.related-posts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.related-post {
  display: flex;
  gap: 16px;
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-md);
  padding: 14px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.related-post:hover {
  border-color: rgba(97, 194, 68, 0.4);
  box-shadow: var(--shadow-md);
}

.related-post img {
  width: 110px;
  height: 90px;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.related-post__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.related-post__category {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--green-600, #3d9a23);
}

.related-post__body strong {
  font-size: 0.96rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--navy-900);
}

.related-post__more {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--green-600, #3d9a23);
}

/* ── Footer ── */
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
  .post__layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .post__sidebar {
    position: static;
    order: -1;
  }

  .post__main {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .related-posts {
    grid-template-columns: 1fr;
  }

  .related-post img {
    width: 96px;
    height: 80px;
  }

  .post__faq h2 {
    margin-bottom: 16px;
  }
}
</style>
