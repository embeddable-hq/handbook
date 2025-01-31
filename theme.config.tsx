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
  docsRepositoryBase: 'https://github.com/embeddable-hq/handbook',
  useNextSeoProps: () => {
    return {
      description: "Documentation for Embeddable.com",
      titleTemplate: "%s | Embeddable Handbook"
    };
  },
  footer: {
    text: 'Embeddable Docs, 2025',
  },
}

export default config
