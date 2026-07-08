<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import logoImage from '../assets/images/logo.webp'
import AppIcon from './AppIcon.vue'
import { company } from '../data/company'
import { pests } from '../data/pests'

const { trackGoal } = useMetrika()
const { goToHomeSection } = useHomeAnchor()

const navigation = [
  { label: 'Как мы работаем', hash: '#process' },
  { label: 'Отзывы', hash: '#reviews' },
  { label: 'Вопросы', hash: '#faq' },
  { label: 'Контакты', hash: '#contacts' },
]

const mobileMenuBreakpoint = 1040
const isMenuOpen = ref(false)
let mediaQuery

function closeMenu() {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

function onHomeAnchorClick(event, hash) {
  goToHomeSection(hash, event)
  closeMenu()
}

onMounted(() => {
  mediaQuery = window.matchMedia(`(min-width: ${mobileMenuBreakpoint + 1}px)`)
  mediaQuery.addEventListener('change', closeMenu)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', closeMenu)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--open': isMenuOpen }">
    <div class="container header__inner">
      <!-- Logo → always goes to main page -->
      <NuxtLink class="brand" to="/" aria-label="Чистая Защита — на главную">
        <img :src="logoImage" alt="" aria-hidden="true" height="48" style="width: auto; display: block;" />
        <span class="brand__copy">
          <strong>{{ company.brand }}</strong>
          <small>{{ company.subtitle }}</small>
        </span>
      </NuxtLink>

      <!-- Backdrop overlay (teleported to body to escape header stacking context) -->
      <!-- ClientOnly: backdrop only appears via client interaction; avoids Teleport+Transition SSR hydration mismatch -->
      <ClientOnly>
        <Teleport to="body">
          <Transition name="backdrop">
            <div v-if="isMenuOpen" class="menu-backdrop" @click="closeMenu" aria-hidden="true" />
          </Transition>
        </Teleport>
      </ClientOnly>

      <!-- Phone quick-dial + hamburger -->
      <a class="header__phone-quick" :href="company.phoneHref" aria-label="Позвонить" @click="trackGoal('phone_click')">
        <AppIcon name="phone" :size="20" />
      </a>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="site-navigation"
        :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="toggleMenu"
      >
        <AppIcon :name="isMenuOpen ? 'close' : 'menu'" :size="22" />
      </button>

      <!-- Desktop nav -->
      <nav id="site-navigation" class="nav" aria-label="Основная навигация">
        <a href="/#services" @click="onHomeAnchorClick($event, '#services')">Услуги</a>
        <NuxtLink to="/blog">Блог</NuxtLink>
        <a
          v-for="item in navigation"
          :key="item.hash"
          :href="`/${item.hash}`"
          @click="onHomeAnchorClick($event, item.hash)"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Desktop CTA -->
      <div class="header__cta">
        <div class="header__contact">
          <div class="header__phones">
            <a class="header__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
            <a class="header__phone header__phone--secondary" :href="company.phoneSecondaryHref" @click="trackGoal('phone_click')">{{ company.phoneSecondaryDisplay }}</a>
          </div>
          <span class="header__hours">{{ company.workingHours }}</span>
        </div>
        <a class="button button--ghost button--small" href="/#contacts" @click="onHomeAnchorClick($event, '#contacts')">
          Перезвоните мне
        </a>
      </div>

      <!-- Mobile: scrollable menu body -->
      <Transition name="menu-slide">
        <div v-if="isMenuOpen" class="menu-body" aria-label="Меню">
          <nav class="nav nav--open" aria-label="Основная навигация">
            <!-- Услуги + подсписок вредителей -->
            <span class="nav__section-label">Услуги</span>
            <div class="nav__pest-list">
              <NuxtLink
                v-for="pest in pests"
                :key="pest.slug"
                :to="`/vrediteli/${pest.slug}`"
                class="nav__pest-link"
                @click="closeMenu"
              >
                {{ pest.nameNominative }}
              </NuxtLink>
            </div>

            <div class="nav__divider" aria-hidden="true" />

            <NuxtLink to="/blog" @click="closeMenu">Блог</NuxtLink>
            <a
              v-for="item in navigation"
              :key="item.hash"
              :href="`/${item.hash}`"
              @click="onHomeAnchorClick($event, item.hash)"
            >
              {{ item.label }}
            </a>
          </nav>

          <div class="header__cta header__cta--open">
            <div class="header__contact">
              <div class="header__phones">
                <a class="header__phone" :href="company.phoneHref" @click="trackGoal('phone_click')">{{ company.phoneDisplay }}</a>
                <a class="header__phone header__phone--secondary" :href="company.phoneSecondaryHref" @click="trackGoal('phone_click')">{{ company.phoneSecondaryDisplay }}</a>
              </div>
              <span class="header__hours">{{ company.workingHours }}</span>
            </div>
            <a
              class="button button--ghost button--small"
              href="/#contacts"
              @click="onHomeAnchorClick($event, '#contacts')"
            >
              Перезвоните мне
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
