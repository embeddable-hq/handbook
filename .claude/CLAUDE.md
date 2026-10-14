# Embeddable Handbook

Documentation site for [Embeddable](https://embeddable.com/) - a developer toolkit for building customer-facing analytics. Published at https://docs.embeddable.com.

## Tech Stack

- **Next.js** + **Nextra** - Documentation framework
- **React** + **TypeScript**
- **MDX** - Documentation content format
- **Tailwind CSS** - Styling

## Commands

```bash
pnpm dev    # Start dev server at localhost:3000
pnpm build  # Build for production
```

## Project Structure

- `pages/` - MDX documentation files organized by section
- `components/` - Reusable React components (ImageGrid, LinkCard, Video, etc.)
- `public/` - Static assets (images, videos)
- `theme.config.tsx` - Nextra theme customization

## Documentation Sections & Audiences

| Section | Target Audience |
|---------|-----------------|
| Introduction | Anyone new to Embeddable |
| Getting Started | React engineers |
| Connect your data | Data people, integration engineers |
| Data modeling | Data people (SQL-comfortable) |
| Building components | React engineers |
| Dashboards | Non-technical dashboard builders |
| Self-serve | Builders enabling end-user data exploration (Custom Canvas, AI) |
| Deployment | Integration engineers |

## Writing Guidelines

- **Write to the audience**, not about them ("To start using..." not "Data people can...")
- **Link important concepts** rather than just bolding them
- **Include visuals** - screenshots, gifs, or videos when discussing the platform
- **Include code snippets** when explaining SDK or Cube features
- **Keep it short** - this is a reference manual, not a blog post
- **Use bullet points** over long paragraphs
- **Start with Why** - explain what the concept is and why it matters before how

## Page Structure Template

1. Start with What + Why
2. Show a practical example early
3. Explain How step-by-step
4. Separate core concepts from edge cases
5. Write for scanning (short sections, headings, bullets)

## FAQ

The FAQ page (`pages/faq.mdx`) renders every entry in `pages/faqs.json` via `components/FaqPaginated.tsx`. To add an FAQ, append an object with these fields (2-space indentation, newest entries first):

- `question` - a real question in Headline Case, e.g. "How Do I Use Tailwind CSS Inside Custom Components?"
- `slug` - the question lowercased, spaces to hyphens, everything except letters, digits and hyphens deleted (underscores too). Must be unique. **Never change a slug once published** - pages link to `/faq#<slug>`
- `answer` - raw Markdown. Link to other handbook pages with relative paths (`/deployment/tokens-api`), never absolute `docs.embeddable.com` URLs
- `created_at` - full ISO timestamp, e.g. `2026-04-22T13:20:07.926Z` (use the current time for new entries)

Images go in `public/img/faq/` and are referenced as `/img/faq/<file>` - don't hotlink external images.

## Deployment

Automatic via Vercel when changes are pushed to main.
