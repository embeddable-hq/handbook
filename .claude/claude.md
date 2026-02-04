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

## Deployment

Automatic via Vercel when changes are pushed to main.
