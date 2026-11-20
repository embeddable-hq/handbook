// scripts/build-agent-files.mjs
// Runs before `next build`. Writes into public/:
//   llms.txt        index of every docs page, in sidebar order
//   llms-full.txt   every non-legacy page in one Markdown file
//   <route>.md      a Markdown twin of every page (only when WRITE_TWINS is true)
import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'node:fs/promises'
import path from 'node:path'

const SITE = 'https://docs.embeddable.com'
const WRITE_TWINS = false // task A5 sets this to true

const HEADER = `# Embeddable

> Embeddable is a developer toolkit for building customer-facing analytics — embedded dashboards, self-serve analytics, and AI-powered insights — into your own application. Engineers define components, data models, and themes in code; their team assembles and publishes dashboards with a no-code builder or directly in code.

This file lists every page of the Embeddable documentation. All pages in one file: ${SITE}/llms-full.txt
Index of the marketing site (product, pricing, security, comparisons): https://embeddable.com/llms.txt
`

const readJson = async (file) => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return {}
  }
}

const routeOf = (file) =>
  '/' + file.replace(/^pages\//, '').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')

// Position of a page in the sidebar: one index per folder level, read from each _meta.json.
async function sidebarInfo(route) {
  const parts = route === '/' ? ['index'] : route.slice(1).split('/')
  const order = []
  let dir = 'pages'
  let title
  let external = false
  for (const part of parts) {
    const meta = await readJson(path.join(dir, '_meta.json'))
    const keys = Object.keys(meta)
    order.push(keys.includes(part) ? keys.indexOf(part) : 999)
    const entry = meta[part]
    title = typeof entry === 'string' ? entry : entry?.title
    if (entry && typeof entry === 'object' && entry.href) external = true
    dir = path.join(dir, part)
  }
  return { order, title, external }
}

const absolute = (text) =>
  text.replace(/\]\(\/(?!\/)/g, `](${SITE}/`).replace(/(src|href)="\/(?!\/)/g, `$1="${SITE}/`)

// MDX to plain Markdown. Code fences are left exactly as they are.
async function toMarkdown(content) {
  const faqs = (await readJson('pages/faqs.json')).faqs ?? []
  const changelog = await readJson('pages/component-libraries/remarkable-pro/changelog.json')
  const segments = content.split(/(^```[\s\S]*?^```[^\n]*$)/m)
  const out = segments.map((segment, i) => {
    if (i % 2 === 1) return segment // a code fence
    let s = segment
    s = s.replace(/^(import|export)\s.*$/gm, '')
    s = s.replace(/<FaqPaginated\s*\/>/g, () =>
      faqs.map((f) => `## ${f.question}\n\n${f.answer}`).join('\n\n'),
    )
    s = s.replace(/<ChangelogPaginated\s*\/>/g, () =>
      (Array.isArray(changelog) ? changelog : [])
        .map((c) => `### ${c.version} (${c.date})\n\n${(c.notes ?? []).map((n) => `- ${n}`).join('\n')}`)
        .join('\n\n'),
    )
    s = s.replace(
      /^[ \t]*<LinkCard\b([^>]*)>([\s\S]*?)<\/LinkCard>/gm,
      (_, attrs, text) => {
        const title = /title="([^"]*)"/.exec(attrs)?.[1] ?? ''
        const href = /href="([^"]*)"/.exec(attrs)?.[1] ?? ''
        return `- [${title}](${href}): ${text.trim()}`
      },
    )
    s = s.replace(/<Callout\b[^>]*>([\s\S]*?)<\/Callout>/g, (_, text) =>
      text
        .trim()
        .split('\n')
        .map((line) => `> ${line.trim()}`)
        .join('\n'),
    )
    s = s.replace(/<(VideoComponent|ExternalVideo)\b[\s\S]*?\/>/g, (tag) => {
      const src = /src="([^"]*)"/.exec(tag)?.[1]
      return src ? `Video: ${src.startsWith('/') ? SITE + src : src}` : ''
    })
    s = s.replace(/<Bruno\s*\/>/g, 'API collection: https://github.com/embeddable-hq/embeddable-public-apis')
    s = s.replace(/<[A-Z][A-Za-z]*\b[^<]*?\/>/g, '') // other self-closing components, e.g. ImageGrid
    s = s.replace(/<\/?[A-Z][A-Za-z]*\b[^>]*>/g, '') // wrappers such as Steps, CardGrid: keep their text
    s = s.replace(/<br\s*\/?>/g, '')
    return absolute(s)
  })
  return out.join('').replace(/\n{3,}/g, '\n\n').trim()
}

const pages = []
for (const file of await globby('pages/**/*.{md,mdx}')) {
  const route = routeOf(file)
  const { data, content } = matter(await fs.readFile(file, 'utf8'))
  const { order, title, external } = await sidebarInfo(route)
  if (external) continue // top-bar links to other sites (contact, roadmap)
  if (route === '/self-serve/custom-canvas') continue // redirects to its introduction page
  const h1 = /^#\s+(.+)$/m.exec(content)?.[1]
  pages.push({
    route,
    order,
    title: data.title && data.title !== 'Home' ? data.title : h1 ?? title ?? route,
    description: data.description ?? '',
    body: await toMarkdown(content),
  })
}
pages.sort((a, b) => {
  for (let i = 0; i < Math.max(a.order.length, b.order.length); i++) {
    const d = (a.order[i] ?? -1) - (b.order[i] ?? -1)
    if (d) return d
  }
  return 0
})

const rootMeta = await readJson('pages/_meta.json')
const sectionOf = (page) => {
  const top = page.route === '/' ? 'index' : page.route.split('/')[1]
  if (top === 'legacy') return 'Optional'
  const isFolder = page.route.split('/').length > 2
  if (!isFolder && top !== 'index') return 'More'
  const entry = rootMeta[top]
  return typeof entry === 'string' ? entry : entry?.title ?? top
}

const url = (page) => SITE + (page.route === '/' ? '' : page.route) + (WRITE_TWINS ? (page.route === '/' ? '/index.md' : '.md') : '')

const sections = new Map()
for (const page of pages) {
  const name = sectionOf(page)
  if (!sections.has(name)) sections.set(name, [])
  sections.get(name).push(page)
}
// "More" and "Optional" go last, in that order.
const names = [...sections.keys()].filter((n) => n !== 'More' && n !== 'Optional')
if (sections.has('More')) names.push('More')
if (sections.has('Optional')) names.push('Optional')

let llms = HEADER
for (const name of names) {
  llms += `\n## ${name}\n\n`
  for (const page of sections.get(name)) {
    llms += `- [${page.title}](${url(page)})${page.description ? `: ${page.description}` : ''}\n`
  }
}

const full = pages
  .filter((page) => sectionOf(page) !== 'Optional')
  .map((page) => `${page.body}\n\nSource: ${SITE}${page.route === '/' ? '' : page.route}`)
  .join('\n\n---\n\n')

await fs.mkdir('public', { recursive: true })
await fs.writeFile('public/llms.txt', llms)
await fs.writeFile('public/llms-full.txt', full + '\n')

if (WRITE_TWINS) {
  for (const page of pages) {
    const dest = path.join('public', (page.route === '/' ? '/index' : page.route) + '.md')
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, `${page.body}\n\n---\nSource: ${SITE}${page.route === '/' ? '' : page.route}\n`)
  }
}

console.log(`agent files: ${pages.length} pages, ${names.length} sections`)
