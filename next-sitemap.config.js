/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://docs.embeddable.com',
    generateRobotsTxt: true, // (optional)
    generateIndexSitemap: false,
    transform: async (config, path) => {
      return {
        loc: path
      }
    }
  }