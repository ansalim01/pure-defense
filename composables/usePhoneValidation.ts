const PHONE_RE = /^(\+7|7|8)\d{10}$/

export function usePhoneValidation() {
  function cleanPhone(value: string): string {
    return value.replace(/[\s\-()]/g, '')
  }

  function isValidPhone(value: string): boolean {
    return PHONE_RE.test(cleanPhone(value))
  }

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (digits.length === 0) return ''

    // Normalize to 7XXXXXXXXXX
    let d = digits[0] === '8' ? '7' + digits.slice(1)
          : digits[0] === '7' ? digits
          : '7' + digits

    d = d.slice(0, 11)

    if (d.length <= 1) return '+7'
    if (d.length <= 4) return `+7 (${d.slice(1)}`
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`
  }

  function onPhoneKeydown(e: KeyboardEvent): void {
    const allow = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End',
    ]
    if (allow.includes(e.key) || e.ctrlKey || e.metaKey || /^\d$/.test(e.key)) return
    e.preventDefault()
  }

  return { isValidPhone, cleanPhone, formatPhone, onPhoneKeydown }
}
