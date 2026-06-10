/**
 * Composable for working with Telegram WebApp API.
 *
 * Provides a safe way to check if we're running inside Telegram and to open
 * external links correctly. In Telegram's in-app browser, `openLink()` ensures
 * the URL opens in the system browser (so maps apps, phone dialer, etc. work).
 *
 * Usage:
 *   const { isTelegram, openExternalLink } = useTelegramWebApp()
 *   <a @click.prevent="openExternalLink(mapsUrl)">Открыть карту</a>
 */
export function useTelegramWebApp() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tg = process.client ? (window as any).Telegram?.WebApp : null

  /** true when running inside Telegram's in-app browser */
  const isTelegram = !!tg

  /**
   * Open a URL. Inside Telegram WebView this uses tg.openLink() so the OS
   * handles deep links (Yandex Maps app, mail app, etc.) correctly.
   * Outside Telegram falls back to window.open().
   */
  function openExternalLink(url: string): void {
    if (tg) {
      tg.openLink(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return { isTelegram, openExternalLink }
}
