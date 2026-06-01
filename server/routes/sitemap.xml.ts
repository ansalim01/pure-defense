import { setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-url'

export default defineEventHandler((event) => {
  const siteOrigin = getSiteOrigin(event)
  const lastModified = new Date().toISOString()
  const routes = [
    {
      loc: `${siteOrigin}/`,
      lastmod: lastModified,
      priority: '1.0',
    },
    {
      loc: `${siteOrigin}/privacy`,
      lastmod: lastModified,
      priority: '0.3',
    },
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
