import { getRequestURL, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export function getSiteOrigin(event: H3Event) {
  const configuredUrl = useRuntimeConfig(event).public.siteUrl?.trim().replace(/\/+$/, '')
  return configuredUrl || getRequestURL(event).origin
}
