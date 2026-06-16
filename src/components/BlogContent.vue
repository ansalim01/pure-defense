<script setup>
// Renders authored content blocks (see src/data/posts.ts). Paragraph/callout/
// list content is trusted editorial HTML (never user input), so v-html is safe
// and lets us embed internal links to service pages for SEO.
defineProps({
  blocks: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="blog-content">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'heading'" class="blog-content__h2">{{ block.text }}</h2>

      <h3 v-else-if="block.type === 'subheading'" class="blog-content__h3">{{ block.text }}</h3>

      <p v-else-if="block.type === 'paragraph'" class="blog-content__p" v-html="block.html" />

      <ol v-else-if="block.type === 'list' && block.ordered" class="blog-content__list blog-content__list--ordered">
        <li v-for="(item, i) in block.items" :key="i" v-html="item" />
      </ol>

      <ul v-else-if="block.type === 'list'" class="blog-content__list">
        <li v-for="(item, i) in block.items" :key="i" v-html="item" />
      </ul>

      <aside v-else-if="block.type === 'callout'" class="blog-content__callout">
        <p v-if="block.title" class="blog-content__callout-title">{{ block.title }}</p>
        <p class="blog-content__callout-text" v-html="block.html" />
      </aside>

      <figure v-else-if="block.type === 'quote'" class="blog-content__quote">
        <blockquote>{{ block.text }}</blockquote>
        <figcaption v-if="block.author">{{ block.author }}</figcaption>
      </figure>
    </template>
  </div>
</template>

<style scoped>
.blog-content {
  color: #34465c;
  font-size: 1.0625rem;
  line-height: 1.75;
}

.blog-content__h2 {
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  font-weight: 800;
  color: var(--navy-900);
  line-height: 1.25;
  margin: 40px 0 16px;
  scroll-margin-top: 90px;
}

.blog-content__h3 {
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--navy-900);
  margin: 28px 0 10px;
}

.blog-content__p {
  margin: 0 0 18px;
}

.blog-content :deep(a) {
  color: var(--green-600, #3d9a23);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: rgba(97, 194, 68, 0.4);
  transition: text-decoration-color 0.2s;
}

.blog-content :deep(a:hover) {
  text-decoration-color: var(--green-500);
}

.blog-content__list {
  margin: 0 0 20px;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-content__list li {
  position: relative;
  padding-left: 30px;
}

.blog-content__list li::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0.62em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-500);
}

.blog-content__list--ordered {
  counter-reset: blog-step;
}

.blog-content__list--ordered li {
  counter-increment: blog-step;
  padding-left: 38px;
}

.blog-content__list--ordered li::before {
  content: counter(blog-step);
  top: 0.1em;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--green-100);
  color: #2c6e1f;
  font-size: 0.82rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-content__callout {
  margin: 28px 0;
  padding: 22px 26px;
  background: var(--green-100);
  border: 1px solid rgba(97, 194, 68, 0.25);
  border-left: 4px solid var(--green-500);
  border-radius: var(--radius-md);
}

.blog-content__callout-title {
  margin: 0 0 6px;
  font-weight: 800;
  color: #2c6e1f;
  font-size: 1.0625rem;
}

.blog-content__callout-text {
  margin: 0;
  color: #34465c;
}

.blog-content__quote {
  margin: 32px 0;
  padding: 4px 0 4px 26px;
  border-left: 4px solid var(--green-500);
}

.blog-content__quote blockquote {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 600;
  font-style: italic;
  color: var(--navy-800);
  line-height: 1.55;
}

.blog-content__quote figcaption {
  margin-top: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--slate-700);
  font-style: normal;
}

@media (max-width: 540px) {
  .blog-content {
    font-size: 1rem;
  }

  .blog-content__callout {
    padding: 18px 18px;
  }
}
</style>
