<script setup>
import { computed, reactive } from 'vue'
const { trackGoal } = useMetrika()
import AppHeader from '~/src/components/AppHeader.vue'
import AppIcon from '~/src/components/AppIcon.vue'
import heroFallbackImage from '~/src/assets/images/hero-main.webp'
import { company, siteMeta } from '~/src/data/company'
import { pests } from '~/src/data/pests'

const pageTitle = 'Цены на дезинсекцию и дезинфекцию в Казани'
const metaTitle = 'Цены на обработку от вредителей в Казани — прайс'
const metaDesc =
  'Цены на уничтожение тараканов, клопов, крыс, мышей, муравьёв и плесени в Казани. Прайс по квартирам, домам и коммерческим помещениям. Выезд и осмотр — бесплатно.'

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = computed(() => {
  const configured = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configured || requestUrl.origin
})
const canonicalUrl = computed(() => `${siteOrigin.value}/ceny`)
const homeUrl = computed(() => `${siteOrigin.value}/`)
const ogImageUrl = computed(() => new URL(heroFallbackImage, siteOrigin.value).toString())

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Цены', item: canonicalUrl.value },
      ],
    },
    {
      '@type': 'OfferCatalog',
      name: pageTitle,
      itemListElement: pests.map((pest) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: pest.title, url: `${homeUrl.value}vrediteli/${pest.slug}` },
        price: pest.priceValue,
        priceCurrency: 'RUB',
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
    await $fetch('/api/lead', { method: 'POST', body: { phone: form.phone, service: 'Запрос цены' } })
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
  <div class="ceny-page">
    <AppHeader />

    <main>
      <nav class="breadcrumb" aria-label="Навигация по сайту">
        <div class="container breadcrumb__inner">
          <NuxtLink to="/">Главная</NuxtLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Цены</span>
        </div>
      </nav>

      <section class="ceny-hero">
        <div class="container">
          <h1 class="ceny-hero__title">{{ pageTitle }}</h1>
          <p class="ceny-hero__lead">
            Ниже — ориентировочный прайс на обработку. Точная стоимость зависит от площади, степени заражения
            и выбранного метода. Выезд и осмотр по Казани — бесплатно.
          </p>
          <div class="ceny-hero__actions">
            <a class="button button--primary" :href="company.phoneHref" @click="trackGoal('phone_click')">
              <AppIcon name="phone" :size="18" />
              Узнать точную цену
            </a>
            <a class="button button--ghost" href="#ceny-form">Оставить заявку</a>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container ceny-grid">
          <article v-for="pest in pests" :key="pest.slug" class="ceny-card">
            <div class="ceny-card__head">
              <span class="ceny-card__icon">
                <AppIcon :name="pest.icon || 'bug'" :size="22" />
              </span>
              <NuxtLink :to="`/vrediteli/${pest.slug}`" class="ceny-card__title">{{ pest.title }}</NuxtLink>
            </div>
            <table class="ceny-table">
              <tbody>
                <tr v-for="row in pest.priceTable" :key="row.label">
                  <td>{{ row.label }}</td>
                  <td class="ceny-table__price">{{ row.price }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </section>

      <section id="ceny-form" class="section section--compact section--bottom-space">
        <div class="container">
          <div class="ceny-cta">
            <div class="ceny-cta__info">
              <div class="section-heading section-heading--left">
                <p>Бесплатная консультация</p>
                <h2>Рассчитаем стоимость по телефону</h2>
              </div>
              <p class="ceny-cta__desc">Опишите проблему — назовём точную цену и подберём удобное время выезда.</p>
              <div class="ceny-cta__contacts">
                <a class="ceny-cta__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
                <span class="ceny-cta__hours">{{ company.workingHours }}</span>
              </div>
            </div>
            <form class="ceny-cta__form" @submit.prevent="submitForm">
              <div v-if="form.success" class="form-success">
                <AppIcon name="check" :size="24" />
                Заявка принята! Перезвоним в ближайшее время.
              </div>
              <template v-else>
                <label class="visually-hidden" for="ceny-phone">Ваш телефон</label>
                <input
                  id="ceny-phone"
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
                <p v-else class="ceny-form__note">
                  <AppIcon name="lock" :size="14" />
                  Ваши данные защищены
                </p>
              </template>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="ceny-footer">
      <div class="container ceny-footer__inner">
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
      <a class="mobile-cta__form" href="#ceny-form">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
  </div>
</template>

<style scoped>
.ceny-page {
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

.ceny-hero {
  background: var(--navy-950);
  padding: 52px 0;
}

.ceny-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  max-width: 820px;
}

.ceny-hero__lead {
  color: rgba(255 255 255 / 0.75);
  line-height: 1.7;
  max-width: 720px;
  margin: 0 0 26px;
}

.ceny-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ceny-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.ceny-card {
  background: #fff;
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
}

.ceny-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.ceny-card__icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--green-100);
  color: var(--green-600);
  flex-shrink: 0;
}

.ceny-card__title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #24364d;
  text-decoration: none;
}

.ceny-card__title:hover {
  color: var(--green-600);
}

.ceny-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.ceny-table tr {
  border-bottom: 1px solid var(--slate-200);
}

.ceny-table tr:last-child {
  border-bottom: none;
}

.ceny-table td {
  padding: 11px 0;
  color: var(--navy-900);
}

.ceny-table__price {
  text-align: right;
  font-weight: 700;
  color: var(--green-600);
  white-space: nowrap;
  padding-left: 16px;
}

.ceny-cta {
  background: var(--navy-950);
  border-radius: var(--radius-xl);
  padding: 44px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.ceny-cta :deep(.section-heading p) {
  color: var(--green-400);
}

.ceny-cta :deep(.section-heading h2) {
  color: #fff;
}

.ceny-cta__desc {
  color: rgba(255 255 255 / 0.7);
  font-size: 0.9375rem;
  margin: 0 0 20px;
}

.ceny-cta__contacts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ceny-cta__phone {
  color: #fff;
  font-size: 1.375rem;
  font-weight: 700;
  text-decoration: none;
}

.ceny-cta__hours {
  color: rgba(255 255 255 / 0.5);
  font-size: 0.875rem;
}

.ceny-cta__form input {
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

.ceny-cta__form input::placeholder {
  color: rgba(255 255 255 / 0.4);
}

.ceny-cta__form input:focus {
  outline: none;
  border-color: var(--green-500);
}

.ceny-form__note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255 255 255 / 0.45);
  font-size: 0.8rem;
  margin: 10px 0 0;
}

.ceny-footer {
  margin-top: auto;
  background: var(--navy-950);
  padding: 20px 0;
}

.ceny-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8125rem;
  color: rgba(255 255 255 / 0.45);
}

.ceny-footer__inner a {
  color: rgba(255 255 255 / 0.7);
  text-decoration: none;
}

@media (max-width: 900px) {
  .ceny-grid {
    grid-template-columns: 1fr;
  }

  .ceny-cta {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }
}
</style>
