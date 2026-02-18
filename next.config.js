const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  // Ensure proper content revalidation
  incrementalCacheHandlerPath: false,
})

module.exports = withNextra({
  transpilePackages: [
    '@inkeep/cxkit-react',
    '@inkeep/cxkit-primitives',
    '@inkeep/cxkit-styled',
    '@inkeep/agents-ui'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for ESM/CJS interop issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'use-sync-external-store/shim': false,
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/component-libraries/remarkable-pro/styling/token-reference',
        destination: '/component-libraries/remarkable-pro/styling/component-tokens#reference',
        permanent: true,
      },
    ]
  }
})
