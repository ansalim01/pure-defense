<script setup>
import { computed } from 'vue'
import heroImage from '~/src/assets/images/hero-main.jpg'
import SiteApp from '~/src/App.vue'
import { company, seoFaqs, seoReviews, seoServices, siteMeta } from '~/src/data/company'

const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()

const siteOrigin = computed(() => {
  const configuredUrl = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  return configuredUrl || requestUrl.origin
})

const canonicalUrl = computed(() => new URL('/', `${siteOrigin.value}/`).toString())
const ogImageUrl = computed(() => new URL(heroImage, siteOrigin.value).toString())
const pageTitle = siteMeta.homeTitle
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${canonicalUrl.value}#website`,
      url: canonicalUrl.value,
      name: siteMeta.siteName,
      inLanguage: siteMeta.language,
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl.value}#webpage`,
      url: canonicalUrl.value,
      name: `${pageTitle} | ${siteMeta.siteName}`,
      isPartOf: { '@id': `${canonicalUrl.value}#website` },
      about: { '@id': `${canonicalUrl.value}#business` },
      description: siteMeta.description,
      inLanguage: siteMeta.language,
    },
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${canonicalUrl.value}#business`,
      name: company.brand,
      legalName: company.legalName,
      url: canonicalUrl.value,
      image: ogImageUrl.value,
      description: siteMeta.description,
      telephone: company.phoneSchema,
      email: company.email,
      priceRange: siteMeta.priceRange,
      currenciesAccepted: 'RUB',
      areaServed: siteMeta.serviceArea.map((name) => ({
        '@type': name === 'Казань' ? 'City' : 'AdministrativeArea',
        name,
      })),
      sameAs: [company.avitoProfile],
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.streetAddress,
        addressLocality: company.locality,
        addressRegion: company.region,
        addressCountry: company.countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '55.796391',
        longitude: '49.108891',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: company.phoneSchema,
          email: company.email,
          contactType: 'customer support',
          areaServed: company.region,
          availableLanguage: ['Russian'],
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        ratingCount: String(seoReviews.length),
        reviewCount: String(seoReviews.length),
        bestRating: '5',
        worstRating: '1',
      },
      review: seoReviews.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.datePublished,
        reviewRating: { '@type': 'Rating', ratingValue: r.ratingValue, bestRating: '5' },
        reviewBody: r.text,
      })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Услуги по дезинсекции и дезинфекции',
        itemListElement: seoServices.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            areaServed: company.locality,
          },
          price: service.price,
          priceCurrency: 'RUB',
        })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl.value}#faq`,
      mainEntity: seoFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
}))
const structuredDataJson = computed(() => JSON.stringify(structuredData.value))

useServerSeoMeta({
  title: pageTitle,
  description: siteMeta.description,
  ogTitle: pageTitle,
  ogDescription: siteMeta.description,
  ogType: 'website',
  ogLocale: siteMeta.locale,
  ogSiteName: siteMeta.siteName,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogImageAlt: siteMeta.ogImageAlt,
  ogImageWidth: '1536',
  ogImageHeight: '1024',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: siteMeta.description,
  twitterImage: ogImageUrl,
  twitterImageAlt: siteMeta.ogImageAlt,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  author: company.legalName,
})

useHead({
  link: [
    { rel: 'preload', as: 'image', href: heroImage, fetchpriority: 'high' },
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'ru-RU', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: structuredDataJson,
    },
  ],
})
</script>

<template>
  <SiteApp />
</template>
