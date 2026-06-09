<script setup>
import { computed } from 'vue'
import { company } from '~/src/data/company'
import AppHeader from '~/src/components/AppHeader.vue'

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()

const siteOrigin = computed(() => {
  const configuredUrl = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configuredUrl || requestUrl.origin
})

const canonicalUrl = computed(() => new URL('/privacy', `${siteOrigin.value}/`).toString())

useServerSeoMeta({
  title: 'Политика конфиденциальности',
  description: `Политика обработки персональных данных на сайте ${company.brand}.`,
  robots: 'noindex, follow',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <div class="legal-page">
    <AppHeader />
    <div class="container">
      <article class="legal-card">
        <div class="section-heading section-heading--left">
          <p>Документы</p>
          <h1>Политика конфиденциальности</h1>
        </div>

        <p class="legal-card__lead">
          Настоящая политика описывает порядок обработки персональных данных, которые пользователь
          передаёт через формы на сайте {{ company.brand }}.
        </p>

        <section>
          <h2>1. Оператор персональных данных</h2>
          <p>
            Оператор: {{ company.legalName }}, ИНН {{ company.inn }}, ОГРНИП {{ company.ogrnip }}.
            Адрес: {{ company.address }}.
          </p>
        </section>

        <section>
          <h2>2. Какие данные мы можем получать</h2>
          <ul>
            <li>имя, указанное в форме обратной связи;</li>
            <li>номер телефона для обратного звонка и согласования выезда;</li>
            <li>дополнительные сведения, которые пользователь сообщает добровольно при обращении.</li>
          </ul>
        </section>

        <section>
          <h2>3. Для чего используются данные</h2>
          <ul>
            <li>для связи с пользователем и консультации по услугам;</li>
            <li>для расчёта стоимости и согласования времени выезда;</li>
            <li>для исполнения договора и ведения клиентской переписки.</li>
          </ul>
        </section>

        <section>
          <h2>4. Как обрабатываются и хранятся данные</h2>
          <p>
            Персональные данные обрабатываются законными способами, в объёме, необходимом для
            ответа на обращение и оказания услуги. Данные не передаются третьим лицам без
            законных оснований, кроме случаев, предусмотренных законодательством Российской
            Федерации.
          </p>
        </section>

        <section>
          <h2>5. Права пользователя</h2>
          <ul>
            <li>запросить уточнение, обновление или удаление персональных данных;</li>
            <li>отозвать согласие на обработку данных;</li>
            <li>обратиться по вопросам обработки данных по контактам ниже.</li>
          </ul>
        </section>

        <section>
          <h2>6. Контакты</h2>
          <ul>
            <li>
              Телефон:
              <a class="text-link" :href="company.phoneHref">{{ company.phoneDisplay }}</a>
            </li>
            <li>
              Email:
              <a class="text-link" :href="company.emailHref">{{ company.email }}</a>
            </li>
            <li>
              Адрес:
              <a class="text-link" :href="company.mapsHref" target="_blank" rel="noopener noreferrer">
                {{ company.address }}
              </a>
            </li>
          </ul>
        </section>
      </article>
    </div>
  </div>
</template>
