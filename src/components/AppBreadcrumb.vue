<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // { label: string, to: string } | { label: string, current: true }
  },
})
</script>

<template>
  <nav class="breadcrumb" aria-label="Навигация по сайту">
    <div class="container breadcrumb__inner">
      <template v-for="(item, index) in items" :key="index">
        <span v-if="index > 0" aria-hidden="true">/</span>
        <span v-if="item.current" aria-current="page">{{ item.label }}</span>
        <NuxtLink v-else :to="item.to" external>{{ item.label }}</NuxtLink>
      </template>
    </div>
  </nav>
</template>
