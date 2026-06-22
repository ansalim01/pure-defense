/**
 * Аптайм-монитор для dez-profi-kazan.ru на Cloudflare Workers.
 *
 * Раз в N минут (Cron Trigger) дёргает сайт и, если он не отвечает,
 * шлёт алерт в Telegram. Состояние (up/down) хранится в KV, поэтому
 * сообщение приходит ОДИН раз на падение и ОДИН раз на восстановление —
 * без спама. Перед алертом о падении ждёт FAIL_THRESHOLD неудач подряд,
 * чтобы одиночный сетевой сбой не поднимал ложную тревогу.
 *
 * Работает на edge Cloudflare — полностью снаружи твоего VPS,
 * поэтому ловит даже полное падение сервера (сеть/питание/ООМ).
 */

const STATE_KEY = 'state'

export default {
  // Запуск по расписанию (cron задан в wrangler.toml)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runCheck(env))
  },

  // Ручная проверка/статус через браузер:
  //   GET /        → показать текущее состояние
  //   GET /run     → прогнать проверку прямо сейчас
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/run') {
      return Response.json(await runCheck(env))
    }
    return Response.json({ ok: true, monitor: env.SITE_URL, state: await readState(env) })
  },
}

async function runCheck(env) {
  const siteUrl = env.SITE_URL
  const threshold = Number(env.FAIL_THRESHOLD ?? 2)
  const timeoutMs = Number(env.TIMEOUT_MS ?? 15000)

  const prev = await readState(env)
  const probe = await probeSite(siteUrl, timeoutMs, env.MUST_INCLUDE)
  const now = Date.now()

  if (probe.ok) {
    // Сайт жив. Если до этого лежал — шлём «поднялся».
    if (prev.status === 'down') {
      await sendTelegram(env, recoveredMessage(siteUrl, now - (prev.since ?? now)))
    }
    await writeState(env, { status: 'up', since: now, fails: 0 })
    return { status: 'up', probe }
  }

  // Сайт не ответил как надо — копим неудачи.
  const fails = (prev.fails ?? 0) + 1

  if (prev.status !== 'down' && fails >= threshold) {
    // Перешли в состояние «лежит» — алертим один раз.
    await sendTelegram(env, downMessage(siteUrl, probe))
    await writeState(env, { status: 'down', since: now, fails })
    return { status: 'down', alerted: true, probe }
  }

  // Либо ещё не добрали до порога, либо уже алертили раньше.
  await writeState(env, {
    status: prev.status === 'down' ? 'down' : 'up',
    since: prev.status === 'down' ? prev.since : now,
    fails,
  })
  return { status: prev.status, alerted: false, fails, probe }
}

async function probeSite(siteUrl, timeoutMs, mustInclude) {
  const started = Date.now()
  try {
    const res = await fetch(siteUrl, {
      method: 'GET',
      redirect: 'manual', // 3xx (http→https / слэш) считаем нормой, не ходим по ним
      headers: { 'User-Agent': 'PureDefense-UptimeBot/1.0 (+https://dez-profi-kazan.ru)' },
      signal: AbortSignal.timeout(timeoutMs),
      cf: { cacheTtl: 0 }, // никогда не отдаём из кэша Cloudflare
    })
    const ms = Date.now() - started

    if (!(res.status >= 200 && res.status < 400)) {
      return { ok: false, status: res.status, ms }
    }

    // Опциональная проверка содержимого: страница должна содержать MUST_INCLUDE.
    // Ловит случай, когда сервер отдаёт 200, но это страница-заглушка/ошибка.
    if (mustInclude) {
      const body = await res.text()
      if (!body.includes(mustInclude)) {
        return { ok: false, status: res.status, ms, reason: `на странице нет «${mustInclude}»` }
      }
    }

    return { ok: true, status: res.status, ms }
  } catch (err) {
    const ms = Date.now() - started
    const reason = err?.name === 'TimeoutError' ? `таймаут > ${timeoutMs} мс` : err?.message || 'сетевая ошибка'
    return { ok: false, status: 0, ms, reason }
  }
}

async function sendTelegram(env, text) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('Не заданы TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
    return
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) console.error('Telegram API error', res.status, await res.text())
  } catch (err) {
    console.error('Не удалось отправить в Telegram', err)
  }
}

function downMessage(siteUrl, probe) {
  const why = probe.status ? `HTTP ${probe.status}` : probe.reason || 'нет ответа'
  return [
    '🔴 *Сайт не отвечает*',
    '',
    `🌐 ${siteUrl}`,
    `⚠️ Причина: ${why}`,
    `🕐 ${moscowTime()} МСК`,
  ].join('\n')
}

function recoveredMessage(siteUrl, downForMs) {
  return [
    '🟢 *Сайт снова работает*',
    '',
    `🌐 ${siteUrl}`,
    `⏱ Простой: ~${humanDuration(downForMs)}`,
    `🕐 ${moscowTime()} МСК`,
  ].join('\n')
}

function moscowTime(ts = Date.now()) {
  return new Date(ts).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function humanDuration(ms) {
  const min = Math.max(1, Math.round(ms / 60000))
  if (min < 60) return `${min} мин`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} ч ${m} мин` : `${h} ч`
}

async function readState(env) {
  const raw = await env.MONITOR_KV.get(STATE_KEY)
  const fallback = { status: 'up', since: Date.now(), fails: 0 }
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function writeState(env, state) {
  await env.MONITOR_KV.put(STATE_KEY, JSON.stringify(state))
}
