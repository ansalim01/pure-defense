// Nuxt auto-generates <link rel="prefetch" as="image" ...> hints for the route
// image assets. Per the HTML spec the `as` attribute is only valid on
// rel="preload"/"modulepreload", so the Nu Html Checker (vnu) reports each of
// these prefetch links as an error. Strip `as` from prefetch links only — the
// prefetch hint stays valid and the behaviour is unchanged. preload/modulepreload
// links keep their (required) `as`.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    const stripPrefetchAs = (chunk: string) =>
      chunk.replace(/<link\b[^>]*>/g, (tag) =>
        tag.includes('rel="prefetch"') ? tag.replace(/\s+as="[^"]*"/g, '') : tag,
      )
    html.head = html.head.map(stripPrefetchAs)
  })
})
