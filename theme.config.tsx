import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <div style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}><img style={{ height: "50px" }} src="/img/icon.png" />Embeddable Docs</div>,
  project: {
    link: 'https://github.com/embeddable-hq',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  docsRepositoryBase: 'https://github.com/embeddable-hq/handbook/blob/main',
  useNextSeoProps: () => {
    return {
      // description: "Documentation for Embeddable.com",
      titleTemplate: "%s | Embeddable Documentation"
    };
  },
  head: (
    <>
      <link rel="icon" href="/img/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon.png" />
    </>
  ),
  footer: {
    text: 'Embeddable Docs, 2025',
  },
}

export default config
