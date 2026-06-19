import { setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-url'
import { posts } from '../../src/data/posts'
import { pests } from '../../src/data/pests'
import { segments } from '../../src/data/segments'

const lastModified = new Date().toISOString().split('T')[0]

const pestSlugs = pests.map((pest) => pest.slug)
const segmentSlugs = segments.map((segment) => segment.slug)

export default defineEventHandler((event) => {
  const siteOrigin = getSiteOrigin(event)
  const routes = [
    { loc: `${siteOrigin}/`, lastmod: lastModified, priority: '1.0' },
    ...pestSlugs.map((slug) => ({
      loc: `${siteOrigin}/vrediteli/${slug}`,
      lastmod: lastModified,
      priority: '0.8',
    })),
    ...segmentSlugs.map((slug) => ({
      loc: `${siteOrigin}/uslugi/${slug}`,
      lastmod: lastModified,
      priority: '0.7',
    })),
    { loc: `${siteOrigin}/rayony`, lastmod: lastModified, priority: '0.6' },
    { loc: `${siteOrigin}/blog`, lastmod: lastModified, priority: '0.6' },
    ...posts.map((post) => ({
      loc: `${siteOrigin}/blog/${post.slug}`,
      lastmod: post.dateModified,
      priority: '0.7',
    })),
    { loc: `${siteOrigin}/privacy`, lastmod: lastModified, priority: '0.3' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return body
})
