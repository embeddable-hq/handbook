const { execSync } = require('node:child_process')
const fs = require('node:fs')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://docs.embeddable.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/contact', '/roadmap', '/self-serve/custom-canvas'],
  transform: async (config, route) => {
    const base = `pages${route === '/' ? '/index' : route}`
    const file = [`${base}.mdx`, `${base}.md`, `${base}/index.mdx`].find((f) => fs.existsSync(f))
    let lastmod
    if (file) {
      try {
        lastmod = execSync(`git log -1 --format=%cI -- "${file}"`).toString().trim() || undefined
      } catch {}
    }
    return { loc: route, lastmod }
  },
}
