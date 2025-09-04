import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import ImageGrid from './components/ImageGrid'
import LinkCard from './components/LinkCard'
import VideoComponent from './components/Video'
import { Steps } from 'nextra/components'
import { Callout } from 'nextra-theme-docs'
import CardGrid from './components/CardGrid'
import ExternalVideo from './components/ExternalVideo'
import Bruno from './components/Bruno'
import { InkeepChat } from './components/InkeepChatButton'

const config: DocsThemeConfig = {
  logo: <div style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}><img style={{ height: "50px" }} src="/img/icon.png" />Embeddable Docs</div>,
  project: {
    link: 'https://github.com/embeddable-hq',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  docsRepositoryBase: 'https://github.com/embeddable-hq/handbook/blob/main',
  components: {
    'Bruno': Bruno,
    'ImageGrid': ImageGrid,
    'LinkCard': LinkCard,
    'CardGrid': CardGrid,
    'VideoComponent': VideoComponent,
    'Steps': Steps,
    'Callout': Callout,
    'ExternalVideo': ExternalVideo
  },
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
    component: () => <InkeepChat />
  },
}

export default config
