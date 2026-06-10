<script setup>
import { computed, reactive, ref } from 'vue'
import { useTelegramWebApp } from '~/composables/useTelegramWebApp'

const { openExternalLink } = useTelegramWebApp()
import logoImage from './assets/images/logo.png'
import heroImage from './assets/images/hero-main.jpg'
import serviceBedbugImage from './assets/images/service-bedbug.jpg'
import serviceCockroachImage from './assets/images/service-cockroach.jpg'
import serviceDisinfectionImage from './assets/images/service-disinfection.jpg'
import serviceMoldImage from './assets/images/service-mold.jpg'
import serviceRatImage from './assets/images/service-rat.jpg'
import workImage from './assets/images/work.jpg'
import workImage2 from './assets/images/work02.jpg'
import workImage3 from './assets/images/wokr03.jpg'

const workImages = [workImage, workImage2, workImage3]
import AppHeader from './components/AppHeader.vue'
import AppIcon from './components/AppIcon.vue'
import DistrictMap from './components/DistrictMap.vue'
import { company } from './data/company'

const navigation = [
  { label: 'Услуги', href: '#services' },
  { label: 'Как мы работаем', href: '#process' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Вопросы', href: '#faq' },
  { label: 'Контакты', href: '#contacts' },
]

const heroFacts = [
  'Гарантия до 1 года',
  'Безопасно для детей и животных',
  'Выезд за 1 час',
  'Работаем официально',
]

const heroHighlights = [
  {
    icon: 'beaker',
    title: 'Эффективные препараты',
    text: 'Сертифицированы',
  },
  {
    icon: 'leaf',
    title: 'Безопасно для людей',
    text: 'И домашних животных',
  },
  {
    icon: 'shield',
    title: 'Гарантия результата',
    text: 'До 1 года',
  },
]

const services = [
  {
    icon: 'bug',
    theme: 'amber',
    title: 'Уничтожение тараканов',
    subtitle: 'Кухни, санузлы, кафе, общежития',
    price: 'от 2000 ₽',
    image: serviceCockroachImage,
    alt: 'Таракан крупным планом на белом фоне',
    position: 'center center',
    width: 820,
    height: 820,
    href: '/vrediteli/tarakany',
  },
  {
    icon: 'bed',
    theme: 'sand',
    title: 'Уничтожение клопов',
    subtitle: 'Квартиры, гостиницы и спальные зоны',
    price: 'от 2500 ₽',
    image: serviceBedbugImage,
    alt: 'Постельные клопы крупным планом на ткани',
    position: 'center center',
    width: 1014,
    height: 714,
    href: '/vrediteli/klopy',
  },
  {
    icon: 'rat',
    theme: 'stone',
    title: 'Дератизация',
    subtitle: 'Крысы, мыши, подвалы, склады',
    price: 'от 3500 ₽',
    image: serviceRatImage,
    alt: 'Крыса на светлом фоне',
    position: 'center center',
    width: 600,
    height: 399,
    href: '/vrediteli/krysy',
  },
  {
    icon: 'spray',
    theme: 'sky',
    title: 'Дезинфекция помещений',
    subtitle: 'После арендаторов, ремонта и ЧП',
    price: 'от 1500 ₽',
    image: serviceDisinfectionImage,
    alt: 'Специалист проводит обработку помещения у окна',
    position: 'center center',
    width: 626,
    height: 417,
    href: '/vrediteli/dezinfekciya',
  },
  {
    icon: 'mold',
    theme: 'sage',
    title: 'Удаление плесени',
    subtitle: 'Стены, откосы, санузлы и балконы',
    price: 'от 1200 ₽',
    image: serviceMoldImage,
    alt: 'Плесень в углу стены возле плинтуса',
    position: 'center center',
    width: 868,
    height: 651,
    href: '/vrediteli/pleseni',
  },
]

const advantages = [
  {
    icon: 'document',
    title: 'Работаем официально',
    text: 'Заключаем договор и выдаём все документы.',
  },
  {
    icon: 'beaker',
    title: 'Сертифицированные препараты',
    text: 'Используем проверенные профессиональные составы.',
  },
  {
    icon: 'leaf',
    title: 'Безопасно для детей и животных',
    text: 'Подбираем схему обработки под условия помещения.',
  },
  {
    icon: 'clock',
    title: 'Выезд за 1 час',
    text: 'Быстро приезжаем по Казани и ближайшим районам.',
  },
  {
    icon: 'repeat',
    title: 'Гарантия до 1 года',
    text: 'При необходимости проводим повторный выезд.',
  },
  {
    icon: 'users',
    title: 'Опыт более 5 лет',
    text: 'Работаем с квартирами, домами и коммерцией.',
  },
]

const steps = [
  {
    icon: 'phone',
    title: 'Вы оставляете заявку',
    text: 'Позвоните или оставьте заявку на сайте.',
  },
  {
    icon: 'headset',
    title: 'Консультация',
    text: 'Уточняем детали и рассчитываем стоимость.',
  },
  {
    icon: 'car',
    title: 'Выезд специалиста',
    text: 'Приезжаем в удобное для вас время.',
  },
  {
    icon: 'spray',
    title: 'Проведение обработки',
    text: 'Проводим безопасную и эффективную обработку.',
  },
  {
    icon: 'shield-check',
    title: 'Результат и гарантия',
    text: 'Вы получаете чистоту, спокойствие и гарантию.',
  },
]

const reviews = [
  {
    name: 'Клиент Avito · февраль 2025',
    text: 'После первой обработки клопы перестали беспокоить. Всё подробно объяснили, вежливо общались и качественно выполнили работу.',
  },
  {
    name: 'Клиент Avito · ноябрь 2024',
    text: 'Специалисты приехали в удобное время, провели обработку от тараканов и потом были на связи. После повторной процедуры проблема ушла.',
  },
  {
    name: 'Клиент Avito · февраль 2024',
    text: 'Приехали вовремя, ждать не пришлось, всё прошло спокойно и даже составили договор. Впечатление осталось хорошее.',
  },
  {
    name: 'Клиент Avito · декабрь 2023',
    text: 'Стоимость обсудили заранее, специалист всё доступно объяснил и аккуратно выполнил обработку. На вопросы ответили без спешки.',
  },
]

const faqs = [
  {
    question: 'Безопасно ли это для детей и животных?',
    answer:
      'Да. Используем препараты, которые рассчитаны на бытовое применение профессионалами. После обработки даём понятную инструкцию по проветриванию и возвращению в помещение.',
  },
  {
    question: 'Нужно ли покидать квартиру на время обработки?',
    answer:
      'Обычно да, на 2-4 часа в зависимости от выбранного метода и типа вредителя. Точные рекомендации специалист озвучит до выезда.',
  },
  {
    question: 'Будет ли неприятный запах после обработки?',
    answer:
      'Сильного стойкого запаха не остаётся. Современные препараты выветриваются быстро, особенно при соблюдении рекомендаций по проветриванию.',
  },
  {
    question: 'Сколько длится обработка?',
    answer:
      'В среднем от 30 минут до 1,5 часов. Время зависит от площади, степени заражения и выбранного способа обработки.',
  },
  {
    question: 'Когда будет виден результат?',
    answer:
      'Первые результаты обычно заметны в тот же день. Полный эффект наступает постепенно, когда препарат срабатывает по всей колонии.',
  },
  {
    question: 'Как долго сохраняется эффект?',
    answer:
      'Остаточный барьер держится от нескольких недель до нескольких месяцев. Для сложных случаев рекомендуем закрепляющую обработку и гарантию.',
  },
]

const districts = [
  'Вахитовский район',
  'Приволжский район',
  'Советский район',
  'Ново-Савиновский район',
  'Авиастроительный район',
  'Московский район',
  'Кировский район',
  'Лаишевский район',
  'Высокогорский район',
  'и другие районы области',
]

const districtColumns = [districts.slice(0, 5), districts.slice(5)]
const faqsWithIndex = faqs.map((faq, index) => ({ ...faq, index }))
const faqColumns = [faqsWithIndex.slice(0, 3), faqsWithIndex.slice(3)]
const openedFaq = ref(0)
const reviewOffset = ref(0)

const visibleReviews = computed(() =>
  Array.from({ length: Math.min(3, reviews.length) }, (_, i) => reviews[(reviewOffset.value + i) % reviews.length]),
)

const heroBackgroundStyle = { '--hero-image': `url(${heroImage})` }

const heroForm = reactive({ name: '', phone: '', loading: false, success: false, error: '' })
const contactForm = reactive({ phone: '', loading: false, success: false, error: '' })

function toggleFaq(index) {
  openedFaq.value = openedFaq.value === index ? -1 : index
}

function shiftReviews(direction) {
  const total = reviews.length
  reviewOffset.value = (reviewOffset.value + direction + total) % total
}

async function submitHeroForm() {
  if (heroForm.loading) return
  heroForm.loading = true
  heroForm.error = ''
  try {
    await $fetch('/api/lead', {
      method: 'POST',
      body: { name: heroForm.name, phone: heroForm.phone },
    })
    heroForm.success = true
    heroForm.name = ''
    heroForm.phone = ''
  } catch {
    heroForm.error = 'Ошибка отправки. Позвоните нам напрямую.'
  } finally {
    heroForm.loading = false
  }
}

async function submitContactForm() {
  if (contactForm.loading) return
  contactForm.loading = true
  contactForm.error = ''
  try {
    await $fetch('/api/lead', {
      method: 'POST',
      body: { phone: contactForm.phone },
    })
    contactForm.success = true
    contactForm.phone = ''
  } catch {
    contactForm.error = 'Ошибка отправки. Позвоните нам напрямую.'
  } finally {
    contactForm.loading = false
  }
}

</script>

<template>
  <div class="page">
    <AppHeader />

    <main id="main-content">
      <section id="hero" class="hero">
        <div class="container hero__grid" :style="heroBackgroundStyle">
          <div class="hero__content">
            <h1 class="hero__title">
              <span class="hero__title-line">Уничтожим тараканов, клопов</span>
              <span class="hero__title-line hero__title-line--compact">
                и других вредителей <span>в&nbsp;Казани</span>
              </span>
            </h1>
            <div class="hero__meta" aria-label="Преимущества">
              <span v-for="fact in heroFacts" :key="fact">{{ fact }}</span>
            </div>
            <p class="hero__lead">
              Проводим дезинсекцию, дератизацию, дезинфекцию и удаление плесени в квартирах,
              домах и коммерческих помещениях по Казани и области.
            </p>

            <div class="hero__highlights">
              <article v-for="item in heroHighlights" :key="item.title" class="hero-highlight">
                <span class="hero-highlight__icon">
                  <AppIcon :name="item.icon" :size="24" />
                </span>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.text }}</p>
                </div>
              </article>
            </div>

            <div class="hero__actions">
              <a class="button button--primary" :href="company.phoneHref">
                <AppIcon name="phone" :size="18" />
                Позвонить сейчас
              </a>
            </div>
          </div>

          <div class="hero__stage">
            <form class="hero-form" @submit.prevent="submitHeroForm">
              <h2>Получите <span>бесплатную консультацию</span></h2>

              <div v-if="heroForm.success" class="form-success">
                <AppIcon name="check" :size="20" />
                Заявка принята! Перезвоним в ближайшее время.
              </div>

              <template v-else>
                <label class="visually-hidden" for="hero-name">Ваше имя</label>
                <input
                  id="hero-name"
                  v-model="heroForm.name"
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  autocomplete="name"
                  :disabled="heroForm.loading"
                />
                <label class="visually-hidden" for="hero-phone">Телефон</label>
                <input
                  id="hero-phone"
                  v-model="heroForm.phone"
                  type="tel"
                  name="phone"
                  placeholder="Телефон"
                  autocomplete="tel"
                  inputmode="tel"
                  required
                  :disabled="heroForm.loading"
                />
                <button class="button button--primary button--block" type="submit" :disabled="heroForm.loading">
                  {{ heroForm.loading ? 'Отправляем...' : 'Оставить заявку' }}
                </button>
                <p v-if="heroForm.error" class="form-error">{{ heroForm.error }}</p>
                <p v-else class="hero-form__note">
                  <AppIcon name="lock" :size="16" />
                  Ваши данные защищены
                </p>
              </template>
            </form>
          </div>
        </div>
      </section>

      <section id="services" class="section">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Основные направления</p>
            <h2>Наши услуги</h2>
          </div>

          <div class="service-grid">
            <article v-for="service in services" :key="service.title" class="service-card">
              <div class="service-card__media" :class="`service-card__media--${service.theme}`">
                <img
                  class="service-card__image"
                  :src="service.image"
                  :alt="service.alt"
                  :width="service.width"
                  :height="service.height"
                  :style="{ objectPosition: service.position }"
                  loading="lazy"
                />
                <div class="service-card__placeholder">
                  <span class="service-card__placeholder-icon">
                    <AppIcon :name="service.icon" :size="50" />
                  </span>
                </div>
              </div>
              <div class="service-card__body">
                <h3>{{ service.title }}</h3>
                <p>{{ service.subtitle }}</p>
                <strong>{{ service.price }}</strong>
                <div class="service-card__actions">
                  <NuxtLink class="button button--line button--small" :to="service.href">Подробнее</NuxtLink>
                  <a class="button button--primary button--small" href="#contacts">Заказать</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Почему выбирают нас</p>
            <h2>Решаем проблему под ключ</h2>
          </div>

          <div class="advantage-panel">
            <article v-for="item in advantages" :key="item.title" class="advantage-card">
              <span class="advantage-card__icon">
                <AppIcon :name="item.icon" :size="30" />
              </span>
              <div class="advantage-card__body">
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="process" class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Прозрачный процесс</p>
            <h2>Как мы работаем</h2>
          </div>

          <div class="steps-grid">
            <article v-for="(step, index) in steps" :key="step.title" class="step-card">
              <div class="step-card__visual">
                <span class="step-card__index">{{ index + 1 }}</span>
                <span class="step-card__icon">
                  <AppIcon :name="step.icon" :size="30" />
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

      <section id="reviews" class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center section-heading--with-actions">
            <div>
              <p>Отзывы с Avito</p>
              <h2>Отзывы наших клиентов</h2>
            </div>

            <div class="review-controls" aria-label="Управление отзывами">
              <button type="button" aria-label="Показать предыдущие отзывы" @click="shiftReviews(-1)">
                <AppIcon name="arrow-left" :size="22" />
              </button>
              <button type="button" aria-label="Показать следующие отзывы" @click="shiftReviews(1)">
                <AppIcon name="arrow-right" :size="22" />
              </button>
            </div>
          </div>

          <div class="review-grid">
            <article v-for="(review, i) in visibleReviews" :key="review.name" class="review-card">
              <div class="review-card__scene" aria-hidden="true">
                <img :src="workImages[(reviewOffset + i) % 3]" alt="" class="review-card__scene-img" loading="lazy" width="900" height="600" />
                <div class="review-card__scene-overlay"></div>
                <div class="review-card__scene-badge">
                  <AppIcon name="shield-check" :size="18" />
                  Проверено
                </div>
              </div>
              <div class="review-card__body">
                <h3>{{ review.name }}</h3>
                <div class="review-card__stars" aria-hidden="true">
                  <AppIcon v-for="star in 5" :key="star" name="star" :size="14" />
                </div>
                <p>{{ review.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" class="section section--compact">
        <div class="container">
          <div class="section-heading section-heading--center">
            <p>Частые вопросы</p>
            <h2>Часто задаваемые вопросы</h2>
          </div>

          <div class="faq-grid">
            <div v-for="(column, columnIndex) in faqColumns" :key="columnIndex" class="faq-column">
              <article
                v-for="item in column"
                :key="item.question"
                class="faq-item"
                :class="{ 'faq-item--open': openedFaq === item.index }"
              >
                <button
                  type="button"
                  class="faq-item__button"
                  :aria-expanded="openedFaq === item.index"
                  @click="toggleFaq(item.index)"
                >
                  <span class="faq-item__label">
                    <AppIcon name="help" :size="18" />
                    {{ item.question }}
                  </span>
                  <AppIcon name="chevron" :size="18" />
                </button>
                <p v-if="openedFaq === item.index" class="faq-item__answer">
                  {{ item.answer }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" class="section section--compact">
        <div class="container contact-grid">
          <form class="contact-card" @submit.prevent="submitContactForm">
            <div class="section-heading section-heading--left">
              <p>Быстрый контакт</p>
              <h2>Остались вопросы? Мы перезвоним!</h2>
            </div>

            <p class="contact-card__text">
              Работаем официально как {{ company.legalName }}. Для связи используйте
              <a class="text-link" :href="company.phoneHref">{{ company.phoneDisplay }}</a>
              или
              <a class="text-link" :href="company.emailHref">{{ company.email }}</a>.
            </p>

            <div v-if="contactForm.success" class="form-success" style="margin-top: 22px;">
              <AppIcon name="check" :size="20" />
              Спасибо! Перезвоним в ближайшее время.
            </div>

            <div v-else class="contact-card__form">
              <label class="visually-hidden" for="lead-phone">Ваш телефон</label>
              <input
                id="lead-phone"
                v-model="contactForm.phone"
                type="tel"
                name="lead-phone"
                placeholder="Ваш телефон"
                autocomplete="tel"
                inputmode="tel"
                required
                :disabled="contactForm.loading"
              />
              <button class="button button--primary" type="submit" :disabled="contactForm.loading">
                <AppIcon name="phone" :size="18" />
                {{ contactForm.loading ? 'Отправляем...' : 'Перезвоните мне' }}
              </button>
            </div>

            <p v-if="contactForm.error" class="form-error">{{ contactForm.error }}</p>

            <div class="contact-card__features">
              <span><AppIcon name="check" :size="16" /> ИНН {{ company.inn }}</span>
              <span><AppIcon name="check" :size="16" /> ОГРНИП {{ company.ogrnip }}</span>
              <span><AppIcon name="check" :size="16" /> БИК {{ company.bik }}</span>
            </div>
          </form>

          <article class="coverage-card">
            <div class="section-heading section-heading--left">
              <p>География выезда</p>
              <h2>Работаем по Казани и области</h2>
            </div>

            <div class="coverage-card__content">
              <div class="coverage-card__list">
                <ul v-for="(column, index) in districtColumns" :key="index">
                  <li v-for="item in column" :key="item">
                    <AppIcon name="pin" :size="16" />
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div class="coverage-card__map">
                <DistrictMap />
              </div>
            </div>
          </article>
        </div>
      </section>

    </main>

    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <a class="brand brand--footer" href="#hero">
            <img :src="logoImage" alt="" aria-hidden="true" height="48" style="width: auto; display: block;" />
            <span class="brand__copy">
              <strong>{{ company.brand }}</strong>
              <small>{{ company.subtitle }}</small>
            </span>
          </a>

          <p>
            Исполнитель услуг: {{ company.legalName }}. Работаем официально, заключаем договор и предоставляем
            реквизиты по запросу.
          </p>
        </div>

        <div class="footer__links">
          <h3>Услуги</h3>
          <NuxtLink to="/vrediteli/tarakany">Уничтожение тараканов</NuxtLink>
          <NuxtLink to="/vrediteli/klopy">Уничтожение клопов</NuxtLink>
          <NuxtLink to="/vrediteli/krysy">Дератизация</NuxtLink>
          <NuxtLink to="/vrediteli/dezinfekciya">Дезинфекция помещений</NuxtLink>
          <NuxtLink to="/vrediteli/pleseni">Удаление плесени</NuxtLink>
        </div>

        <div class="footer__links">
          <h3>Компания</h3>
          <a href="#hero">О нас</a>
          <a href="#process">Как мы работаем</a>
          <a href="#reviews">Отзывы</a>
          <a href="#faq">Вопросы и ответы</a>
          <a href="#contacts">Контакты</a>
        </div>

        <address class="footer__contacts">
          <h3>Контакты</h3>
          <a :href="company.phoneHref">{{ company.phoneDisplay }}</a>
          <a :href="company.emailHref">{{ company.email }}</a>
          <a :href="company.mapsHref" target="_blank" rel="noopener noreferrer" @click.prevent="openExternalLink(company.mapsHref)">{{ company.address }}</a>
          <small>{{ company.legalName }}</small>
          <small>ИНН {{ company.inn }} • ОГРНИП {{ company.ogrnip }}</small>
          <small>р/с {{ company.checkingAccount }}</small>
          <small>к/с {{ company.correspondentAccount }} • БИК {{ company.bik }}</small>
        </address>
      </div>

      <div class="container footer__bottom">
        <span>© {{ new Date().getFullYear() }} {{ company.brand }} / {{ company.legalName }}</span>
        <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
      </div>
    </footer>

    <div class="mobile-cta" aria-label="Быстрые действия">
      <a class="mobile-cta__call" :href="company.phoneHref">
        <span class="mobile-cta__call-icon">
          <AppIcon name="phone" :size="20" />
        </span>
        <span class="mobile-cta__call-label">
          <strong>Позвонить сейчас</strong>
          <small>{{ company.phoneDisplay }}</small>
        </span>
      </a>
      <a class="mobile-cta__form" href="#contacts">
        <AppIcon name="message" :size="15" />
        Оставить заявку
      </a>
    </div>
  </div>
</template>
