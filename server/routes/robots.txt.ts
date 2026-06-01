import { setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-url'

export default defineEventHandler((event) => {
  const siteOrigin = getSiteOrigin(event)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return ['User-agent: *', 'Allow: /', `Sitemap: ${siteOrigin}/sitemap.xml`].join('\n')
})
