<script setup>
import { computed, reactive } from 'vue'
const { trackGoal } = useMetrika()
import AppHeader from '~/src/components/AppHeader.vue'
import AppBreadcrumb from '~/src/components/AppBreadcrumb.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import DistrictMap from '~/src/components/DistrictMap.vue'
import heroFallbackImage from '~/src/assets/images/hero-main.webp'
import { company, siteMeta } from '~/src/data/company'
import { cityDistricts, suburbDistricts } from '~/src/data/districts'

const pageTitle = 'Дезинсекция по районам Казани — выезд за 1 час'
const metaTitle = 'Дезинсекция по районам Казани — выезд за 1 час'
const metaDesc =
  'Уничтожение тараканов, клопов, крыс и других вредителей во всех районах Казани и области: Вахитовский, Ново-Савиновский, Приволжский, Московский, Кировский, Советский, Авиастроительный. Выезд за 1 час.'

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/rayony`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(heroFallbackImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Районы Казани', item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'Service',
      name: 'Дезинсекция, дератизация и дезинфекция в Казани',
      serviceType: 'Санитарная обработка помещений',
      url: canonicalUrl.value,
      provider: { '@type': ['LocalBusiness', 'ProfessionalService'], '@id': `${homeUrl.value}#business`, name: company.brand },
      areaServed: cityDistricts.map((d) => ({ '@type': 'AdministrativeArea', name: d.nameShort })),
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
    await $fetch('/api/lead', { method: 'POST', body: { phone: form.phone, service: 'Заявка (районы)' } })
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
  <div class="rayony-page">
    <AppHeader />

    <main>
      <AppBreadcrumb :items="[
        { label: 'Главная', to: '/' },
        { label: 'Районы Казани', current: true },
      ]" />

      <section class="rayony-hero">
        <div class="container">
          <h1 class="rayony-hero__title">{{ pageTitle }}</h1>
          <p class="rayony-hero__lead">
            Работаем во всех районах Казани и пригороде. Выезд дезинфектора — за 1 час, без наценки за район.
            Уничтожаем тараканов, клопов, крыс, мышей и других вредителей с гарантией до 1 года.
          </p>
          <div class="rayony-hero__actions">
            <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
              <AppIcon name="phone" :size="18" />
              Вызвать в свой район
            </a>
            <a class="button button--ghost" href="#rayony-form">Оставить заявку</a>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container rayony-grid">
          <div class="rayony-districts">
            <div class="section-heading section-heading--left">
              <p>География выезда</p>
              <h2>Районы Казани, куда выезжаем</h2>
            </div>
            <ul class="rayony-list">
              <li v-for="district in cityDistricts" :key="district.slug">
                <span class="rayony-list__icon"><AppIcon name="pin" :size="14" /></span>
                <NuxtLink :to="`/rayony/${district.slug}`">{{ district.name }}</NuxtLink>
              </li>
            </ul>
            <p class="rayony-suburbs">
              <strong>Пригород и область:</strong>
              <NuxtLink
                v-for="(suburb, index) in suburbDistricts"
                :key="suburb.slug"
                :to="`/rayony/${suburb.slug}`"
              >{{ suburb.name }}<template v-if="index < suburbDistricts.length - 1">, </template></NuxtLink>.
            </p>
          </div>
          <div class="rayony-map">
            <DistrictMap />
          </div>
        </div>
      </section>

      <section id="rayony-form" class="section section--compact section--bottom-space">
        <div class="container">
          <div class="rayony-cta">
            <div class="rayony-cta__info">
              <div class="section-heading section-heading--left">
                <p>Быстрый вызов</p>
                <h2>Вызвать специалиста в свой район</h2>
              </div>
              <p class="rayony-cta__desc">Назовите район и проблему — приедем в удобное время, выезд за 1 час.</p>
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
                <label class="visually-hidden" for="rayony-phone">Ваш телефон</label>
                <input
                  id="rayony-phone"
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
                <p v-else class="rayony-form__note">
                  <AppIcon name="lock" :size="14" />
                  Ваши данные защищены
                </p>
              </template>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="rayony-footer">
      <div class="container rayony-footer__inner">
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
      <a class="mobile-cta__form" href="#rayony-form">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
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
  font-size: clamp(1.75rem, 4vw, 2.6rem);
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
  margin: 0 0 26px;
}

.rayony-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rayony-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.rayony-list {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.rayony-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: #24364d;
}

.rayony-list a,
.rayony-suburbs a {
  color: #24364d;
  text-decoration: none;
}

.rayony-list a:hover,
.rayony-suburbs a:hover {
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
  color: #445568;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.rayony-map :deep(.district-map) {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--slate-200);
  display: block;
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

.rayony-form__note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255 255 255 / 0.45);
  font-size: 0.8rem;
  margin: 10px 0 0;
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
  .rayony-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .rayony-cta {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }
}

@media (max-width: 540px) {
  .rayony-list {
    grid-template-columns: 1fr;
  }
}
</style>
