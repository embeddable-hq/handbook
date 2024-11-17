import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Embeddable Handbook</span>,
  project: {
    link: 'https://github.com/embeddable-hq',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/embeddable-hq/handbook',
  useNextSeoProps: () => {
    return {
      description: "Documentation for Embeddable.com",
      titleTemplate: "%s | Embeddable Handbook"
    };
  },
  footer: {
    text: 'Embeddable Handbook',
  },
}

export default config
