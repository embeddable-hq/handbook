const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  // Ensure proper content revalidation
  incrementalCacheHandlerPath: false,
})

module.exports = withNextra()
