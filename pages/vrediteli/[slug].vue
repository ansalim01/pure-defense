<script setup>
import { computed, reactive, ref } from 'vue'
const { trackGoal } = useMetrika()
import serviceCockroachImage from '~/src/assets/images/service-cockroach.jpg'
import serviceBedbugImage from '~/src/assets/images/service-bedbug.jpg'
import serviceRatImage from '~/src/assets/images/service-rat.jpg'
import serviceMoldImage from '~/src/assets/images/service-mold.jpg'
import serviceDisinfectionImage from '~/src/assets/images/service-disinfection.jpg'
import AppHeader from '~/src/components/AppHeader.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import { company, siteMeta } from '~/src/data/company'
import { findPest, pests } from '~/src/data/pests'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const pest = findPest(slug)

if (!pest) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const imageMap = {
  cockroach: serviceCockroachImage,
  bedbug: serviceBedbugImage,
  rat: serviceRatImage,
  mold: serviceMoldImage,
  disinfection: serviceDisinfectionImage,
}
const pestImage = imageMap[pest.imageKey]

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/vrediteli/${pest.slug}`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(pestImage, siteOrigin.value).toString())

// Image dimensions after compression (480px wide, height varies by image)
const ogImageDimensions = {
  cockroach:     { width: '480', height: '480' },
  bedbug:        { width: '480', height: '338' },
  rat:           { width: '480', height: '319' },
  mold:          { width: '480', height: '360' },
  disinfection:  { width: '480', height: '320' },
}
const ogDims = ogImageDimensions[pest.imageKey] ?? { width: '480', height: '360' }

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${homeUrl.value}#services` },
        { '@type': 'ListItem', position: 3, name: pest.nameNominative, item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'Service',
      name: pest.title,
      description: pest.metaDesc,
      url: canonicalUrl.value,
      image: ogImageUrl.value,
      provider: {
        '@type': 'LocalBusiness',
        name: company.brand,
        telephone: company.phoneSchema,
        url: homeUrl.value,
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.streetAddress,
          addressLocality: company.locality,
          addressRegion: company.region,
          addressCountry: company.countryCode,
        },
      },
      areaServed: { '@type': 'City', name: 'Казань' },
      offers: {
        '@type': 'Offer',
        price: pest.priceValue,
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: pest.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
}))

useServerSeoMeta({
  title: pest.metaTitle,
  description: pest.metaDesc,
  ogTitle: pest.metaTitle,
  ogDescription: pest.metaDesc,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt: pest.imageAlt,
  ogImageWidth: ogDims.width,
  ogImageHeight: ogDims.height,
  twitterCard: 'summary_large_image',
  twitterTitle: pest.metaTitle,
  twitterDescription: pest.metaDesc,
  twitterImage: ogImageUrl,
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

const stepIcons = ['wand', 'shield', 'beaker', 'repeat', 'document']
const otherPests = pests.filter((p) => p.slug !== pest.slug)

const openedFaq = ref(0)
function toggleFaq(index) {
  openedFaq.value = openedFaq.value === index ? -1 : index
}

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
    await $fetch('/api/lead', { method: 'POST', body: { phone: form.phone, service: pest.title } })
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
  <div class="pest-page">
    <AppHeader />

    <main>
      <nav class="breadcrumb" aria-label="Навигация по сайту">
        <div class="container breadcrumb__inner">
          <NuxtLink to="/">Главная</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink to="/#services">Услуги</NuxtLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ pest.nameNominative }}</span>
        </div>
      </nav>

      <section class="pest-hero">
        <div class="container pest-hero__grid">
          <div class="pest-hero__content">
            <h1 class="pest-hero__title">{{ pest.title }}</h1>
            <div class="pest-hero__facts" aria-label="Ключевые характеристики">
              <span>{{ pest.price }}</span>
              <span>Выезд за 1 час</span>
              <span>Гарантия {{ pest.guarantee }}</span>
              <span>Официально</span>
            </div>
            <div class="pest-hero__actions">
              <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
                <AppIcon name="phone" :size="18" />
                Позвонить сейчас
              </a>
              <a class="button button--ghost" href="#pest-form">Оставить заявку</a>
            </div>
          </div>

          <div class="pest-hero__media">
            <img
              class="pest-hero__image"
              :src="pestImage"
              :alt="pest.imageAlt"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container pest-about">
          <div class="pest-about__text">
            <div class="section-heading section-heading--left">
              <p>О вредителе</p>
              <h2>{{ pest.nameNominative }}: что важно знать</h2>
            </div>
            <p v-for="para in pest.about" :key="para" class="pest-about__para">{{ para }}</p>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Стоимость услуги</p>
            <h2>Цены на {{ pest.nameGenitive }} в Казани</h2>
          </div>
          <table class="price-table">
            <tbody>
              <tr v-for="row in pest.priceTable" :key="row.label">
                <td>{{ row.label }}</td>
                <td class="price-table__price">{{ row.price }}</td>
              </tr>
            </tbody>
          </table>
          <p class="price-table__note">Точная стоимость определяется после осмотра. Выезд и консультация — бесплатно.</p>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container pest-info-grid">
          <article class="pest-panel pest-panel--signs">
            <h2>{{ pest.signsTitle }}</h2>
            <ul class="pest-list">
              <li v-for="sign in pest.signs" :key="sign">
                <span class="pest-list__icon pest-list__icon--green">
                  <AppIcon name="check" :size="14" />
                </span>
                {{ sign }}
              </li>
            </ul>
          </article>

          <article class="pest-panel pest-panel--risks">
            <h2>{{ pest.risksTitle }}</h2>
            <ul class="pest-list">
              <li v-for="risk in pest.risks" :key="risk">
                <span class="pest-list__icon pest-list__icon--amber">
                  <AppIcon name="shield" :size="14" />
                </span>
                {{ risk }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Порядок работы</p>
            <h2>Как проходит обработка</h2>
          </div>
          <div class="steps-grid">
            <article v-for="(step, index) in pest.steps" :key="step.title" class="step-card">
              <div class="step-card__visual">
                <span class="step-card__index">{{ index + 1 }}</span>
                <span class="step-card__icon">
                  <AppIcon :name="stepIcons[index] || 'shield-check'" :size="30" />
                </span>
              </div>
              <div class="step-card__content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Ответы на вопросы</p>
            <h2>Часто спрашивают про {{ pest.nameGenitive }}</h2>
          </div>
          <div class="faq-grid">
            <div class="faq-column">
              <article
                v-for="(faq, index) in pest.faqs.slice(0, 2)"
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
            <div class="faq-column">
              <article
                v-for="(faq, index) in pest.faqs.slice(2)"
                :key="faq.question"
                class="faq-item"
                :class="{ 'faq-item--open': openedFaq === index + 2 }"
              >
                <button
                  type="button"
                  class="faq-item__button"
                  :aria-expanded="openedFaq === index + 2"
                  @click="toggleFaq(index + 2)"
                >
                  <span class="faq-item__label">
                    <AppIcon name="help" :size="18" />
                    {{ faq.question }}
                  </span>
                  <AppIcon name="chevron" :size="18" />
                </button>
                <p v-if="openedFaq === index + 2" class="faq-item__answer">{{ faq.answer }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="pest-form" class="section section--compact">
        <div class="container">
          <div class="pest-cta-block">
            <div class="pest-cta-block__info">
              <div class="section-heading section-heading--left">
                <p>Быстрый вызов</p>
                <h2>Вызвать специалиста</h2>
              </div>
              <p class="pest-cta-block__desc">
                {{ pest.title }} · {{ pest.price }} · Выезд за 1 час · Гарантия {{ pest.guarantee }}
              </p>
              <div class="pest-cta-block__contacts">
                <a class="pest-cta-block__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
                <span class="pest-cta-block__hours">{{ company.workingHours }}</span>
              </div>
            </div>

            <form class="pest-cta-block__form" @submit.prevent="submitForm">
              <div v-if="form.success" class="form-success">
                <AppIcon name="check" :size="24" />
                Заявка принята! Перезвоним в ближайшее время.
              </div>
              <template v-else>
                <label class="visually-hidden" for="pest-phone">Ваш телефон</label>
                <input
                  id="pest-phone"
                  :value="form.phone"
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  autocomplete="tel"
                  inputmode="tel"
                  :class="{ 'input--error': phoneInvalid }"
                  :disabled="form.loading"
                  @blur="form.touched = true"
                  maxlength="18"
                  @keydown="onPhoneKeydown"
                  @input="form.phone = formatPhone($event.target.value); form.error = ''"
                />
                <button class="button button--primary button--block" type="submit" :disabled="form.loading || !form.phone.trim()">
                  <AppIcon name="phone" :size="18" />
                  {{ form.loading ? 'Отправляем...' : 'Перезвоните мне' }}
                </button>
                <p v-if="form.error" class="form-error">{{ form.error }}</p>
                <p v-else class="pest-form__note">
                  <AppIcon name="lock" :size="14" />
                  Ваши данные защищены
                </p>
              </template>
            </form>
          </div>
        </div>
      </section>

      <section class="section section--compact section--bottom-space">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Другие услуги</p>
            <h2>Также уничтожаем</h2>
          </div>
          <div class="other-pests-grid">
            <NuxtLink
              v-for="other in otherPests"
              :key="other.slug"
              :to="`/vrediteli/${other.slug}`"
              class="other-pest-card"
            >
              <strong>{{ other.nameNominative }}</strong>
              <span>{{ other.price }}</span>
            </NuxtLink>
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
      <a class="mobile-cta__form" href="#pest-form">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
  </div>
</template>

<style scoped>
.pest-page {
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

/* ── Hero ── */
.pest-hero {
  background: var(--navy-950);
  padding: 52px 0 0;
  overflow: hidden;
}

.pest-hero__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: end;
}

.pest-hero__content {
  padding-bottom: 52px;
}

.pest-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 20px;
}

.pest-hero__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.pest-hero__facts span {
  background: rgba(255 255 255 / 0.1);
  color: rgba(255 255 255 / 0.9);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

.pest-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pest-hero__media {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pest-hero__image {
  width: 100%;
  max-width: 440px;
  height: 320px;
  object-fit: cover;
  object-position: center top;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  display: block;
}

/* ── About ── */
.pest-about {
  max-width: 780px;
}

.pest-about__para {
  color: #445568;
  line-height: 1.7;
  margin: 0 0 14px;
  font-size: 1rem;
}

/* ── Info grid ── */
.pest-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pest-panel {
  border-radius: var(--radius-lg);
  padding: 28px 32px;
}

.pest-panel h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 18px;
}

.pest-panel--signs {
  background: var(--green-100);
  border: 1px solid rgba(97 194 68 / 0.25);
}

.pest-panel--signs h2 {
  color: #2c6e1f;
}

.pest-panel--risks {
  background: #fffbeb;
  border: 1px solid rgba(245 158 11 / 0.25);
}

.pest-panel--risks h2 {
  color: #92400e;
}

.pest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pest-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #24364d;
}

.pest-list__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.pest-list__icon--green {
  background: var(--green-500);
  color: #fff;
}

.pest-list__icon--amber {
  background: #f59e0b;
  color: #fff;
}

/* ── CTA block ── */
.pest-cta-block {
  background: var(--navy-950);
  border-radius: var(--radius-xl);
  padding: 44px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.pest-cta-block :deep(.section-heading p) {
  color: var(--green-400);
}

.pest-cta-block :deep(.section-heading h2) {
  color: #fff;
}

.pest-cta-block__desc {
  color: rgba(255 255 255 / 0.7);
  font-size: 0.9375rem;
  margin: 0 0 20px;
}

.pest-cta-block__contacts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pest-cta-block__phone {
  color: #fff;
  font-size: 1.375rem;
  font-weight: 700;
  text-decoration: none;
}

.pest-cta-block__phone:hover {
  color: var(--green-400);
}

.pest-cta-block__hours {
  color: rgba(255 255 255 / 0.5);
  font-size: 0.875rem;
}

.pest-cta-block__form input {
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

.pest-cta-block__form input::placeholder {
  color: rgba(255 255 255 / 0.4);
}

.pest-cta-block__form input:focus {
  outline: none;
  border-color: var(--green-500);
}

.pest-form__note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255 255 255 / 0.45);
  font-size: 0.8rem;
  margin: 10px 0 0;
}

/* ── Other pests ── */
.other-pests-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.other-pest-card {
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

.other-pest-card:hover {
  border-color: var(--green-500);
  box-shadow: var(--shadow-md);
}

.other-pest-card strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #24364d;
}

.other-pest-card span {
  font-size: 0.8125rem;
  color: var(--slate-700);
}

/* ── Price table ── */
.price-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 0.9375rem;
}

.price-table tr {
  border-bottom: 1px solid var(--slate-200);
}

.price-table tr:last-child {
  border-bottom: none;
}

.price-table td {
  padding: 13px 0;
  color: var(--navy-900);
}

.price-table__price {
  text-align: right;
  font-weight: 700;
  color: var(--green-600);
  white-space: nowrap;
  padding-left: 16px;
}

.price-table__note {
  margin-top: 14px;
  font-size: 0.8125rem;
  color: var(--slate-600);
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
@media (max-width: 900px) {
  .pest-hero__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .pest-hero__media {
    display: none;
  }

  .pest-hero__content {
    padding-bottom: 40px;
  }

  .pest-info-grid {
    grid-template-columns: 1fr;
  }

  .pest-cta-block {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }

  .other-pests-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 540px) {
  .pest-hero__actions {
    flex-direction: column;
  }

  .pest-hero__actions .button {
    width: 100%;
    min-height: 52px;
  }

  .pest-hero__facts span {
    font-size: 0.78rem;
    padding: 5px 12px;
  }

  .other-pests-grid {
    grid-template-columns: 1fr 1fr;
  }

  .pest-panel {
    padding: 22px 20px;
  }
}
</style>
