import { readBody, getRequestIP } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone: string = (body?.phone ?? '').trim()
  const name: string = (body?.name ?? '').trim()

  if (!phone) {
    throw createError({ statusCode: 400, message: 'Телефон обязателен' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (token && chatId) {
    const now = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const lines = [
      '🔔 *Новая заявка — Чистая Защита*',
      '',
      `📞 Телефон: \`${phone}\``,
      name ? `👤 Имя: ${name}` : null,
      '',
      `🕐 ${now} МСК`,
    ].filter((l) => l !== null)

    await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'Markdown',
      },
    }).catch(console.error)
  }

  return { ok: true }
})
