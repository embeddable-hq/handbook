import React from 'react'
import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import ImageGrid from './components/ImageGrid'
import LinkCard from './components/LinkCard'
import Pill from './components/Pill'
import VideoComponent from './components/Video'
import { Steps } from 'nextra/components'
import { Callout } from 'nextra-theme-docs'
import CardGrid from './components/CardGrid'
import ExternalVideo from './components/ExternalVideo'
import Bruno from './components/Bruno'
import { InkeepChat } from './components/InkeepChatButton'
import CodeContainer from './components/CodeContainer'
import ChangelogPaginated from './components/ChangelogPaginated'
import FaqPaginated from './components/FaqPaginated'

const SITE = 'https://docs.embeddable.com'
const FALLBACK_DESCRIPTION =
  'Documentation for Embeddable, a developer toolkit for building customer-facing analytics into your own application.'

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
    'ExternalVideo': ExternalVideo,
    'Pill': Pill,
    'CodeContainer': CodeContainer,
    'ChangelogPaginated': ChangelogPaginated,
    'FaqPaginated': FaqPaginated
  },
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    const path = asPath.split(/[?#]/)[0].replace(/\/$/, '')
    const description = frontMatter.description || FALLBACK_DESCRIPTION
    return {
      titleTemplate: '%s | Embeddable Documentation',
      description,
      canonical: SITE + path,
      openGraph: {
        url: SITE + path,
        description,
        images: [{ url: SITE + '/img/og.png', width: 1200, height: 630 }],
      },
      twitter: { cardType: 'summary_large_image' },
    }
  },
  head: function Head() {
    const { asPath } = useRouter()
    const path = asPath.split(/[?#]/)[0].replace(/\/$/, '') || '/index'
    return (
      <>
        <link rel="icon" href="/img/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon.png" />
        <link rel="alternate" type="text/markdown" href={`${SITE}${path}.md`} />
      </>
    )
  },
  footer: {
    text: 'Embeddable Docs',
    component: () => <InkeepChat />
  },
}

export default config
