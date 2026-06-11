const PHONE_RE = /^(\+7|7|8)\d{10}$/

export function usePhoneValidation() {
  function cleanPhone(value: string): string {
    return value.replace(/[\s\-()]/g, '')
  }

  function isValidPhone(value: string): boolean {
    return PHONE_RE.test(cleanPhone(value))
  }

  return { isValidPhone, cleanPhone }
}
