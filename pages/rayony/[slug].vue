<script setup>
import { computed, reactive, ref } from 'vue'
const { trackGoal } = useMetrika()
import AppHeader from '~/src/components/AppHeader.vue'
import AppBreadcrumb from '~/src/components/AppBreadcrumb.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import heroFallbackImage from '~/src/assets/images/hero-main.webp'
import { company, siteMeta } from '~/src/data/company'
import { districts, findDistrict } from '~/src/data/districts'
import { findPest } from '~/src/data/pests'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const district = findDistrict(slug)

if (!district) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const relevantPests = district.relevantPests
  .map((pestSlug) => findPest(pestSlug))
  .filter(Boolean)

const otherDistricts = districts.filter((d) => d.slug !== district.slug).slice(0, 6)

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/rayony/${district.slug}`)
const rayonyUrl = computed(() => `${siteOrigin.value}/rayony`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(heroFallbackImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Районы Казани', item: rayonyUrl.value },
        { '@type': 'ListItem', position: 3, name: district.name, item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'Service',
      name: district.title,
      serviceType: 'Дезинсекция, дератизация и дезинфекция',
      description: district.metaDesc,
      url: canonicalUrl.value,
      provider: {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${homeUrl.value}#business`,
        name: company.brand,
      },
      areaServed: { '@type': 'AdministrativeArea', name: district.name },
    },
    {
      '@type': 'FAQPage',
      mainEntity: district.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
}))

useServerSeoMeta({
  title: district.metaTitle,
  description: district.metaDesc,
  ogTitle: district.metaTitle,
  ogDescription: district.metaDesc,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt: siteMeta.ogImageAlt,
  twitterCard: 'summary_large_image',
  twitterTitle: district.metaTitle,
  twitterDescription: district.metaDesc,
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
    await $fetch('/api/lead', {
      method: 'POST',
      body: { phone: form.phone, service: `Заявка (${district.name})` },
    })
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

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: 'Районы Казани', to: '/rayony' },
  { label: district.name, current: true },
]
</script>

<template>
  <div class="rayony-page">
    <AppHeader />

    <main>
      <AppBreadcrumb :items="breadcrumbItems" />

      <section class="rayony-hero">
        <div class="container">
          <h1 class="rayony-hero__title">{{ district.title }}</h1>
          <p v-for="(paragraph, index) in district.about" :key="index" class="rayony-hero__lead">
            {{ paragraph }}
          </p>
          <div class="rayony-hero__actions">
            <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
              <AppIcon name="phone" :size="18" />
              Вызвать в {{ district.nameShort }}
            </a>
            <a class="button button--ghost" href="#district-form">Оставить заявку</a>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>География выезда</p>
            <h2>Куда выезжаем {{ district.namePrepositional }}</h2>
          </div>
          <ul class="rayony-list">
            <li v-for="landmark in district.landmarks" :key="landmark">
              <span class="rayony-list__icon"><AppIcon name="pin" :size="14" /></span>
              {{ landmark }}
            </li>
          </ul>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Услуги</p>
            <h2>Что заказывают {{ district.namePrepositional }}</h2>
          </div>
          <div class="district-services">
            <NuxtLink
              v-for="pest in relevantPests"
              :key="pest.slug"
              :to="`/vrediteli/${pest.slug}`"
              class="district-services__card"
            >
              <strong>{{ pest.title }}</strong>
              <span>от {{ pest.price }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section v-if="district.faqs.length" class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Вопросы</p>
            <h2>Часто спрашивают про выезд {{ district.namePrepositional }}</h2>
          </div>
          <div class="district-faqs">
            <div v-for="(faq, index) in district.faqs" :key="faq.question" class="district-faq">
              <button
                type="button"
                class="district-faq__button"
                :aria-expanded="openedFaq === index"
                @click="toggleFaq(index)"
              >
                {{ faq.question }}
                <AppIcon name="chevron" :size="18" />
              </button>
              <p v-if="openedFaq === index" class="district-faq__answer">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--left">
            <p>Другие районы</p>
            <h2>Также выезжаем по Казани и области</h2>
          </div>
          <ul class="rayony-list">
            <li v-for="other in otherDistricts" :key="other.slug">
              <span class="rayony-list__icon"><AppIcon name="pin" :size="14" /></span>
              <NuxtLink :to="`/rayony/${other.slug}`">{{ other.name }}</NuxtLink>
            </li>
          </ul>
          <p class="rayony-suburbs">
            <NuxtLink to="/rayony">Все районы выезда →</NuxtLink>
          </p>
        </div>
      </section>

      <section id="district-form" class="section section--compact section--bottom-space">
        <div class="container">
          <div class="rayony-cta">
            <div class="rayony-cta__info">
              <div class="section-heading section-heading--left">
                <p>Быстрый вызов</p>
                <h2>Заказать обработку {{ district.namePrepositional }}</h2>
              </div>
              <p class="rayony-cta__desc">
                Назовите адрес и проблему — приедем за 1 час, без наценки за район.
              </p>
              <div class="rayony-cta__contacts">
                <a class="rayony-cta__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
                <span class="rayony-cta__hours">{{ company.workingHours }}</span>
              </div>
            </div>
            <form class="rayony-cta__form" @submit.prevent="submitForm">
              <div v-if="form.success" class="form-success">
                <AppIcon name="check" :size="24" />
                Заявка принята! Перезвоним в ближайшее время.
              </div>
              <template v-else>
                <label class="visually-hidden" for="district-phone">Ваш телефон</label>
                <input
                  id="district-phone"
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
              </template>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="rayony-footer">
      <div class="container rayony-footer__inner">
        <span>© {{ new Date().getFullYear() }} {{ company.brand }}</span>
        <NuxtLink to="/rayony">Все районы</NuxtLink>
        <NuxtLink to="/">На главную</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.rayony-page {
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
}

.breadcrumb__inner span[aria-current] {
  color: #24364d;
  font-weight: 600;
}

.rayony-hero {
  background: var(--navy-950);
  padding: 52px 0;
}

.rayony-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  max-width: 820px;
}

.rayony-hero__lead {
  color: rgba(255 255 255 / 0.75);
  line-height: 1.7;
  max-width: 720px;
  margin: 0 0 14px;
}

.rayony-hero__lead:last-of-type {
  margin-bottom: 26px;
}

.rayony-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rayony-list {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px 24px;
}

.rayony-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: #24364d;
}

.rayony-list a {
  color: #24364d;
  text-decoration: none;
}

.rayony-list a:hover {
  color: var(--green-600);
}

.rayony-list__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--green-100);
  color: var(--green-600);
}

.rayony-suburbs {
  margin: 22px 0 0;
  font-size: 0.9375rem;
}

.rayony-suburbs a {
  color: var(--green-600);
  font-weight: 600;
  text-decoration: none;
}

.district-services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.district-services__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: #24364d;
  transition: border-color 0.15s;
}

.district-services__card:hover {
  border-color: var(--green-500);
}

.district-services__card span {
  color: var(--green-600);
  font-size: 0.875rem;
}

.district-faqs {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.district-faq {
  background: #fff;
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.district-faq__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  background: none;
  border: none;
  font: inherit;
  font-weight: 600;
  color: #24364d;
  text-align: left;
  cursor: pointer;
}

.district-faq__answer {
  margin: 0;
  padding: 0 18px 16px;
  color: #445568;
  line-height: 1.65;
  font-size: 0.9375rem;
}

.rayony-cta {
  background: var(--navy-950);
  border-radius: var(--radius-xl);
  padding: 44px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.rayony-cta :deep(.section-heading p) {
  color: var(--green-400);
}

.rayony-cta :deep(.section-heading h2) {
  color: #fff;
}

.rayony-cta__desc {
  color: rgba(255 255 255 / 0.7);
  font-size: 0.9375rem;
  margin: 0 0 20px;
}

.rayony-cta__contacts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rayony-cta__phone {
  color: #fff;
  font-size: 1.375rem;
  font-weight: 700;
  text-decoration: none;
}

.rayony-cta__hours {
  color: rgba(255 255 255 / 0.5);
  font-size: 0.875rem;
}

.rayony-cta__form input {
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
}

.rayony-cta__form input::placeholder {
  color: rgba(255 255 255 / 0.4);
}

.rayony-cta__form input:focus {
  outline: none;
  border-color: var(--green-500);
}

.rayony-footer {
  margin-top: auto;
  background: var(--navy-950);
  padding: 20px 0;
}

.rayony-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8125rem;
  color: rgba(255 255 255 / 0.45);
}

.rayony-footer__inner a {
  color: rgba(255 255 255 / 0.7);
  text-decoration: none;
}

@media (max-width: 900px) {
  .rayony-cta {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }
}
</style>
