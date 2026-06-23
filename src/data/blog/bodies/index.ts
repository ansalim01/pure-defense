import type { BlogBlock, BlogFaq } from '../../blog-types'
import { longformAppendBySlug, longformExtraFaqsBySlug } from '../longform-append'
import { body as body1, faqs as faqs1 } from './kak-izbavitsya-ot-tarakanov'
import { body as body2, faqs as faqs2 } from './priznaki-klopov-v-kvartire'
import { body as body3, faqs as faqs3 } from './chem-opasna-chernaya-plesen'
import { body as body4, faqs as faqs4 } from './kak-izbavitsya-ot-myshej-i-krys'
import { body as body5, faqs as faqs5 } from './dezinfekciya-kvartiry-kogda-nuzhna'
import { body as body6, faqs as faqs6 } from './chem-opasny-tarakany-dlya-zdorovya'
import { body as body7, faqs as faqs7 } from './ukusy-klopov-kak-vyglyadyat'
import { body as body8, faqs as faqs8 } from './kak-izbavitsya-ot-pleseni-v-vannoj'
import { body as body9, faqs as faqs9 } from './dezinsekciya-dezinfekciya-deratizaciya-raznica'
import { body as body10, faqs as faqs10 } from './kak-podgotovit-kvartiru-k-obrabotke'
import { body as body11, faqs as faqs11 } from './mozhno-li-doma-posle-obrabotki'
import { body as body12, faqs as faqs12 } from './chto-delat-posle-dezinsekcii'
import { body as body13, faqs as faqs13 } from './kak-vybrat-sluzhbu-dezinsekcii'
import { body as body14, faqs as faqs14 } from './kak-zashchitit-kvartiru-ot-povtornogo-zarazheniya'
import { body as body15, faqs as faqs15 } from './skolko-deystvuet-obrabotka-ot-tarakanov'
import { body as body16, faqs as faqs16 } from './ceny-dezinsekcii-kazan'
import { body as body17, faqs as faqs17 } from './obrabotka-ot-klopov-kazan'

export interface BlogArticleContent {
  body: BlogBlock[]
  faqs: BlogFaq[]
}

export const blogContentBySlug: Record<string, BlogArticleContent> = {
  'kak-izbavitsya-ot-tarakanov': merge(body1, faqs1, 'kak-izbavitsya-ot-tarakanov'),
  'priznaki-klopov-v-kvartire': merge(body2, faqs2, 'priznaki-klopov-v-kvartire'),
  'chem-opasna-chernaya-plesen': merge(body3, faqs3, 'chem-opasna-chernaya-plesen'),
  'kak-izbavitsya-ot-myshej-i-krys': merge(body4, faqs4, 'kak-izbavitsya-ot-myshej-i-krys'),
  'dezinfekciya-kvartiry-kogda-nuzhna': merge(body5, faqs5, 'dezinfekciya-kvartiry-kogda-nuzhna'),
  'chem-opasny-tarakany-dlya-zdorovya': merge(body6, faqs6, 'chem-opasny-tarakany-dlya-zdorovya'),
  'ukusy-klopov-kak-vyglyadyat': merge(body7, faqs7, 'ukusy-klopov-kak-vyglyadyat'),
  'kak-izbavitsya-ot-pleseni-v-vannoj': merge(body8, faqs8, 'kak-izbavitsya-ot-pleseni-v-vannoj'),
  'dezinsekciya-dezinfekciya-deratizaciya-raznica': merge(body9, faqs9, 'dezinsekciya-dezinfekciya-deratizaciya-raznica'),
  'kak-podgotovit-kvartiru-k-obrabotke': merge(body10, faqs10, 'kak-podgotovit-kvartiru-k-obrabotke'),
  'mozhno-li-doma-posle-obrabotki': merge(body11, faqs11, 'mozhno-li-doma-posle-obrabotki'),
  'chto-delat-posle-dezinsekcii': merge(body12, faqs12, 'chto-delat-posle-dezinsekcii'),
  'kak-vybrat-sluzhbu-dezinsekcii': merge(body13, faqs13, 'kak-vybrat-sluzhbu-dezinsekcii'),
  'kak-zashchitit-kvartiru-ot-povtornogo-zarazheniya': merge(body14, faqs14, 'kak-zashchitit-kvartiru-ot-povtornogo-zarazheniya'),
  'skolko-deystvuet-obrabotka-ot-tarakanov': merge(body15, faqs15, 'skolko-deystvuet-obrabotka-ot-tarakanov'),
  'ceny-dezinsekcii-kazan': merge(body16, faqs16, 'ceny-dezinsekcii-kazan'),
  'obrabotka-ot-klopov-kazan': merge(body17, faqs17, 'obrabotka-ot-klopov-kazan'),
}

function merge(body: BlogBlock[], faqs: BlogFaq[], slug: string): BlogArticleContent {
  const append = longformAppendBySlug[slug] ?? []
  const extraFaqs = longformExtraFaqsBySlug[slug] ?? []
  return {
    body: append.length ? [...body, ...append] : body,
    faqs: extraFaqs.length ? [...faqs, ...extraFaqs] : faqs,
  }
}
