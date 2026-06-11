import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone: string = (body?.phone ?? '').trim()

  if (!phone) {
    throw createError({ statusCode: 400, message: 'Телефон обязателен' })
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
