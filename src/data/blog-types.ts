export type BlogImageKey = 'cockroach' | 'bedbug' | 'rat' | 'mold' | 'disinfection'

export interface BlogBlock {
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'callout' | 'quote'
  text?: string
  html?: string
  title?: string
  author?: string
  items?: string[]
  ordered?: boolean
}

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDesc: string
  excerpt: string
  category: string
  datePublished: string
  dateModified: string
  readingMinutes: number
  imageKey: BlogImageKey
  imageAlt: string
  keyTakeaways: string[]
  body: BlogBlock[]
  faqs: BlogFaq[]
  relatedService: { label: string; slug: string }
}

/** ~200 слов/мин — для расчёта readingMinutes из тела статьи */
export function estimateReadingMinutes(blocks: BlogBlock[], faqs: BlogFaq[] = []): number {
  const text = [
    ...blocks.map((b) => b.text || b.html || ''),
    ...blocks.flatMap((b) => b.items || []),
    ...faqs.map((f) => `${f.question} ${f.answer}`),
  ].join(' ')
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(6, Math.round(words / 200))
}
