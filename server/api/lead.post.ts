import { readBody, getRequestIP } from 'h3'

const PHONE_RE = /^(\+7|7|8)\d{10}$/
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 час

// IP → массив временных меток отправок
const rateMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_LIMIT) return true
  hits.push(now)
  rateMap.set(ip, hits)
  return false
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, message: 'Слишком много заявок. Попробуйте позже.' })
  }

  const body = await readBody(event)
  const phone = (body?.phone ?? '').trim().replace(/[\s\-() ]/g, '')

  if (!PHONE_RE.test(phone)) {
    throw createError({ statusCode: 400, message: 'Некорректный номер телефона' })
  }

  const workerUrl = process.env.CLOUDFLARE_WORKER_URL
  const workerSecret = process.env.WORKER_SECRET

  if (workerUrl && workerSecret) {
    const now = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const text = [
      '🔔 *Новая заявка — Чистая Защита*',
      '',
      `📞 Телефон: \`${phone}\``,
      '',
      `🕐 ${now} МСК`,
    ].join('\n')

    await $fetch(workerUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${workerSecret}` },
      body: { text },
    }).catch(console.error)
  }

  return { ok: true }
})
