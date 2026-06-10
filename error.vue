<script setup>
import AppHeader from '~/src/components/AppHeader.vue'
import { company } from '~/src/data/company'

const props = defineProps({
  error: Object,
})

const is404 = computed(() => props.error?.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <AppHeader />

    <main class="error-main">
      <div class="container error-container">
        <div class="error-code" aria-hidden="true">{{ is404 ? '404' : '500' }}</div>

        <div class="section-heading section-heading--center">
          <p>{{ is404 ? 'Страница не найдена' : 'Ошибка сервера' }}</p>
          <h1>{{ is404 ? 'Такой страницы не существует' : 'Что-то пошло не так' }}</h1>
        </div>

        <p class="error-desc">
          {{ is404
            ? 'Возможно, страница была удалена или вы перешли по неверной ссылке. Вернитесь на главную — там есть всё, что нужно.'
            : 'Мы уже работаем над устранением проблемы. Попробуйте обновить страницу или вернитесь позже.' }}
        </p>

        <div class="error-actions">
          <button class="button button--primary" @click="goHome">
            На главную
          </button>
          <a class="button button--ghost" :href="company.phoneHref">
            Позвонить нам
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100dvh;
  min-height: var(--tg-vh, 100dvh);
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.error-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0 80px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  max-width: 520px;
  margin-inline: auto;
}

.error-code {
  font-size: clamp(6rem, 22vw, 10rem);
  font-weight: 900;
  line-height: 1;
  color: transparent;
  background: linear-gradient(135deg, var(--green-500) 0%, #3da826 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* Safari requires this for gradient text */
  background-clip: text;
  letter-spacing: -0.04em;
  user-select: none;
}

.error-desc {
  color: var(--slate-700);
  font-size: 1rem;
  line-height: 1.65;
  max-width: 420px;
}

.error-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .error-actions {
    flex-direction: column;
    width: 100%;
  }
  .error-actions .button {
    width: 100%;
    justify-content: center;
  }
}
</style>
