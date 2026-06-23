export function useHomeAnchor() {
  const route = useRoute()

  function goToHomeSection(hash: string, event?: MouseEvent) {
    const normalized = hash.startsWith('#') ? hash : `#${hash}`
    const target = `/${normalized}`

    if (route.path !== '/') {
      event?.preventDefault()
      window.location.assign(target)
      return
    }

    event?.preventDefault()
    const el = document.querySelector(normalized)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(history.state, '', normalized)
      return
    }

    window.location.assign(target)
  }

  return { goToHomeSection }
}
