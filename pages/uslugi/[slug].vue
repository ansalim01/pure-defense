<script setup>
import { computed, reactive, ref } from 'vue'
const { trackGoal } = useMetrika()
import logoImage from '~/src/assets/images/logo.webp'
import heroFallbackImage from '~/src/assets/images/hero-main.webp'
import AppHeader from '~/src/components/AppHeader.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import { company, siteMeta } from '~/src/data/company'
import { findSegment, segments } from '~/src/data/segments'
import { findPest } from '~/src/data/pests'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const segment = findSegment(slug)

if (!segment) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const relevantPests = segment.relevantPests
  .map((pestSlug) => findPest(pestSlug))
  .filter((pest) => Boolean(pest))

const otherSegments = segments.filter((item) => item.slug !== segment.slug)

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/uslugi/${segment.slug}`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(heroFallbackImage, siteOrigin.value).toString())
const logoUrl = computed(() => new URL(logoImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${homeUrl.value}#services` },
        { '@type': 'ListItem', position: 3, name: segment.navLabel, item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'Service',
      name: segment.title,
      serviceType: 'Дезинсекция, дератизация и дезинфекция',
      category: 'Санитарная обработка помещений',
      description: segment.metaDesc,
      url: canonicalUrl.value,
      image: ogImageUrl.value,
      provider: {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${homeUrl.value}#business`,
        name: company.brand,
        legalName: company.legalName,
        telephone: company.phoneSchema,
        email: company.email,
        url: homeUrl.value,
        logo: { '@type': 'ImageObject', url: logoUrl.value, width: 200, height: 200 },
        priceRange: siteMeta.priceRange,
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.streetAddress,
          addressLocality: company.locality,
          addressRegion: company.region,
          addressCountry: company.countryCode,
        },
      },
      areaServed: { '@type': 'City', name: 'Казань' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: segment.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
}))

useServerSeoMeta({
  title: segment.metaTitle,
  description: segment.metaDesc,
  ogTitle: segment.metaTitle,
  ogDescription: segment.metaDesc,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt: siteMeta.ogImageAlt,
  ogImageWidth: '1200',
  ogImageHeight: '800',
  twitterCard: 'summary_large_image',
  twitterTitle: segment.metaTitle,
  twitterDescription: segment.metaDesc,
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

const form = reactive({ phone: '', loading: false, success: false, error: '', touched: false })
const { isValidPhone, formatPhone, onPhoneKeydown } = usePhoneValidation()
const phoneInvalid = computed(() => form.touched && form.phone.length > 0 && !isValidPhone(form.phone))

async function submitForm() {
  if (form.loading) return
  form.touched = true
  if (!isValidPhone(form.phone)) {
    form.error = 'Введите корректный номер: +7 (900) 000-00-00'
    return
  }
  form.loading = true
  form.error = ''
  try {
    await $fetch('/api/lead', { method: 'POST', body: { phone: form.phone, service: segment.title } })
    form.success = true
    form.phone = ''
    form.touched = false
    trackGoal('form_submit')
  } catch {
    form.error = 'Ошибка отправки. Позвоните нам напрямую.'
  } finally {
    form.loading = false
  }
}
</script>

<template>
  <div class="segment-page">
    <AppHeader />

    <main>
      <nav class="breadcrumb" aria-label="Навигация по сайту">
        <div class="container breadcrumb__inner">
          <NuxtLink to="/">Главная</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink to="/#services">Услуги</NuxtLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ segment.navLabel }}</span>
        </div>
      </nav>

      <section class="segment-hero">
        <div class="container segment-hero__grid">
          <div class="segment-hero__content">
            <h1 class="segment-hero__title">{{ segment.title }}</h1>
            <div class="segment-hero__facts" aria-label="Ключевые характеристики">
              <span>{{ segment.priceFrom }}</span>
              <span>Выезд за 1 час</span>
              <span>Гарантия до 1 года</span>
              <span>Официально, с договором</span>
            </div>
            <div class="segment-hero__actions">
              <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
                <AppIcon name="phone" :size="18" />
                Позвонить сейчас
              </a>
              <a class="button button--ghost" href="#segment-form">Оставить заявку</a>
            </div>
          </div>
          <div class="segment-hero__media" aria-hidden="true">
            <AppIcon :name="segment.icon" :size="72" />
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container segment-intro">
          <p v-for="para in segment.intro" :key="para" class="segment-intro__para">{{ para }}</p>
        </div>
      </section>

      <section v-if="relevantPests.length" class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>С чем поможем</p>
            <h2>Каких вредителей уничтожаем</h2>
          </div>
          <div class="segment-pests-grid">
            <NuxtLink
              v-for="pest in relevantPests"
              :key="pest.slug"
              :to="`/vrediteli/${pest.slug}`"
              class="segment-pest-card"
            >
              <span class="segment-pest-card__icon">
                <AppIcon :name="pest.icon || 'bug'" :size="22" />
              </span>
              <strong>{{ pest.nameNominative }}</strong>
              <span class="segment-pest-card__price">{{ pest.price }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Как мы работаем</p>
            <h2>{{ segment.bulletsTitle }}</h2>
          </div>
          <ul class="segment-list">
            <li v-for="item in segment.bullets" :key="item">
              <span class="segment-list__icon">
                <AppIcon name="check" :size="14" />
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <section id="segment-form" class="section section--compact">
        <div class="container">
          <div class="segment-cta">
            <div class="segment-cta__info">
              <div class="section-heading section-heading--left">
                <p>Быстрый вызов</p>
                <h2>Оставьте заявку</h2>
              </div>
              <p class="segment-cta__desc">{{ segment.title }} · {{ segment.priceFrom }} · Выезд за 1 час · Гарантия</p>
              <div class="segment-cta__contacts">
                <a class="segment-cta__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
                <span class="segment-cta__hours">{{ company.workingHours }}</span>
              </div>
            </div>
            <form class="segment-cta__form" @submit.prevent="submitForm">
              <div v-if="form.success" class="form-success">
                <AppIcon name="check" :size="24" />
                Заявка принята! Перезвоним в ближайшее время.
              </div>
              <template v-else>
                <label class="visually-hidden" for="segment-phone">Ваш телефон</label>
                <input
                  id="segment-phone"
                  :value="form.phone"
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  autocomplete="tel"
                  inputmode="tel"
                  :class="{ 'input--error': phoneInvalid }"
                  :disabled="form.loading"
                  maxlength="18"
                  @blur="form.touched = true"
                  @keydown="onPhoneKeydown"
                  @input="form.phone = formatPhone($event.target.value); form.error = ''"
                />
                <button class="button button--primary button--block" type="submit" :disabled="form.loading || !form.phone.trim()">
                  <AppIcon name="phone" :size="18" />
                  {{ form.loading ? 'Отправляем...' : 'Перезвоните мне' }}
                </button>
                <p v-if="form.error" class="form-error">{{ form.error }}</p>
                <p v-else class="segment-form__note">
                  <AppIcon name="lock" :size="14" />
                  Ваши данные защищены
                </p>
              </template>
            </form>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Ответы на вопросы</p>
            <h2>Частые вопросы</h2>
          </div>
          <div class="segment-faq">
            <details v-for="faq in segment.faqs" :key="faq.question" class="segment-faq__item">
              <summary>{{ faq.question }}</summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section v-if="otherSegments.length" class="section section--compact section--bottom-space">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Другие объекты</p>
            <h2>Также обрабатываем</h2>
          </div>
          <div class="segment-other-grid">
            <NuxtLink
              v-for="item in otherSegments"
              :key="item.slug"
              :to="`/uslugi/${item.slug}`"
              class="segment-other-card"
            >
              <strong>{{ item.navLabel }}</strong>
              <span>{{ item.priceFrom }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="segment-footer">
      <div class="container segment-footer__inner">
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
      <a class="mobile-cta__form" href="#segment-form">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
  </div>
</template>

<style scoped>
.segment-page {
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

.segment-hero {
  background: var(--navy-950);
  padding: 52px 0;
  overflow: hidden;
}

.segment-hero__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  align-items: center;
}

.segment-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 20px;
}

.segment-hero__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.segment-hero__facts span {
  background: rgba(255 255 255 / 0.1);
  color: rgba(255 255 255 / 0.9);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

.segment-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.segment-hero__media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  border-radius: var(--radius-xl);
  background: linear-gradient(160deg, rgba(97 194 68 / 0.18), rgba(255 255 255 / 0.04));
  border: 1px solid rgba(255 255 255 / 0.12);
  color: var(--green-400);
}

.segment-intro {
  max-width: 820px;
}

.segment-intro__para {
  color: #445568;
  line-height: 1.7;
  margin: 0 0 14px;
  font-size: 1rem;
}

.segment-pests-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 22px;
}

.segment-pest-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.segment-pest-card:hover {
  border-color: var(--green-500);
  box-shadow: var(--shadow-md);
}

.segment-pest-card__icon {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--green-100);
  color: var(--green-600);
}

.segment-pest-card strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #24364d;
}

.segment-pest-card__price {
  font-size: 0.8125rem;
  color: var(--slate-700);
}

.segment-list {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 28px;
}

.segment-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #24364d;
}

.segment-list__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  background: var(--green-500);
  color: #fff;
}

.segment-cta {
  background: var(--navy-950);
  border-radius: var(--radius-xl);
  padding: 44px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.segment-cta :deep(.section-heading p) {
  color: var(--green-400);
}

.segment-cta :deep(.section-heading h2) {
  color: #fff;
}

.segment-cta__desc {
  color: rgba(255 255 255 / 0.7);
  font-size: 0.9375rem;
  margin: 0 0 20px;
}

.segment-cta__contacts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.segment-cta__phone {
  color: #fff;
  font-size: 1.375rem;
  font-weight: 700;
  text-decoration: none;
}

.segment-cta__phone:hover {
  color: var(--green-400);
}

.segment-cta__hours {
  color: rgba(255 255 255 / 0.5);
  font-size: 0.875rem;
}

.segment-cta__form input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255 255 255 / 0.1);
  border: 1.5px solid rgba(255 255 255 / 0.18);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}

.segment-cta__form input::placeholder {
  color: rgba(255 255 255 / 0.4);
}

.segment-cta__form input:focus {
  outline: none;
  border-color: var(--green-500);
}

.segment-form__note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255 255 255 / 0.45);
  font-size: 0.8rem;
  margin: 10px 0 0;
}

.segment-faq {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 22px;
}

.segment-faq__item {
  background: #fff;
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.segment-faq__item summary {
  cursor: pointer;
  font-weight: 600;
  color: #24364d;
  font-size: 0.95rem;
}

.segment-faq__item p {
  margin: 12px 0 0;
  color: #445568;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.segment-other-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.segment-other-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.segment-other-card:hover {
  border-color: var(--green-500);
  box-shadow: var(--shadow-md);
}

.segment-other-card strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #24364d;
}

.segment-other-card span {
  font-size: 0.8125rem;
  color: var(--slate-700);
}

.segment-footer {
  margin-top: auto;
  background: var(--navy-950);
  padding: 20px 0;
}

.segment-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8125rem;
  color: rgba(255 255 255 / 0.45);
}

.segment-footer__inner a {
  color: rgba(255 255 255 / 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.segment-footer__inner a:hover {
  color: #fff;
}

@media (max-width: 900px) {
  .segment-hero__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .segment-hero__media {
    display: none;
  }

  .segment-pests-grid {
    grid-template-columns: 1fr 1fr;
  }

  .segment-list {
    grid-template-columns: 1fr;
  }

  .segment-cta {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }

  .segment-other-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .segment-hero__actions {
    flex-direction: column;
  }

  .segment-hero__actions .button {
    width: 100%;
    min-height: 52px;
  }

  .segment-pests-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
