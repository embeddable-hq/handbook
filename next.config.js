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
    // Suppress optional encoding dep from node-fetch (pulled in by @inkeep packages)
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /^encoding$/,
        contextRegExp: /node-fetch/,
      })
    )
    return config
  },
  async redirects() {
    return [
      {
        source: '/dashboards/custom-canvas',
        destination: '/self-serve/custom-canvas',
        permanent: true,
      },
      {
        source: '/dashboards/starter-components',
        destination: '/component-libraries/remarkable-pro/introduction',
        permanent: true,
      },
      {
        source: '/dashboards/building-dashboards',
        destination: '/dashboards/introduction',
        permanent: true,
      },
      {
        source: '/self-serve/ai-endpoint',
        destination: '/self-serve/ai-endpoints',
        permanent: true,
      },
      {
        source: '/component-libraries/remarkable-pro/styling/token-reference',
        destination: '/component-libraries/remarkable-pro/styling/component-tokens#reference',
        permanent: true,
      },
      {
        source: '/development',
        destination: '/getting-started/development/introduction',
        permanent: true,
      },
      {
        source:
          '/development/:page(defining-components|define-component-function|loading-data|interactivity|custom-types|extending-types)',
        destination: '/component-libraries/build-components/:page',
        permanent: true,
      },
      {
        source: '/development/:page(client-context|theming)',
        destination: '/component-libraries/:page',
        permanent: true,
      },
      {
        source: '/development/:page(introduction|local-environment|pushing-code)',
        destination: '/getting-started/development/:page',
        permanent: true,
      },
      {
        source:
          '/getting-started/:page(quick-start-guide|set-up-your-workspace|your-workspace|first-embeddable|theme-components|first-component)',
        destination: '/getting-started/get-set-up/:page',
        permanent: true,
      },
      {
        source:
          '/data-modeling/:page(defining-models|dimensions-and-measures|joins|examples|views|generate-data-models)',
        destination: '/data-modeling/writing-data-models/:page',
        permanent: true,
      },
    ]
  }
})
