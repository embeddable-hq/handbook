# Embeddable Handbook

This is the repo for Embeddable's [Docs](https://docs.embeddable.com).

It uses the [Nextra](https://nextra.site) site generation framework ([Documentation](https://nextra.site/docs/guide)).

It is currently deployed and managed on [Vercel](https://vercel.com/embeddable/handbook).

Any changes pushed to the main branch are automatically deployed to https://docs.embeddable.com.

## Documentation Guidelines

### Writing

- Please follow our **[style guide](STYLEGUIDE.md)**

### Structure

- Keep nesting no more than two levels deep (e.g. Connect your data > Integrations > Cube Cloud).
- Avoid using dropdowns as pages. They can be tricky to navigate, especially on mobile.

## Clone repo

Use `git clone https://github.com/embeddable-hq/handbook.git`

Alternatively, you can try one of these popular git UI tools:

- [Github Desktop](https://github.com/desktop/desktop)
- [Sourcetree](https://www.sourcetreeapp.com/)

## Local Development

Install `pnpm`, e.g: `npm install -g pnpm`

Run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit `https://localhost:3000`.

## Media

Resize images and videos to be no more than 1250px wide.

## Testing final app

Run `pnpm build` to build the app

Run `pnpm run start` to preview the built app

## Deployment

For contributors with access to our Vercel deployment, please also reference the [deployment readme](DEPLOYMENT.md).

## License

This project is licensed under the MIT License.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://docs.embeddable.com/img/logos/colour-horizontal-white-transparent.png, https://docs.embeddable.com/img/logos/colour-horizontal-white-transparent@2x.png 2x">
  <source media="(prefers-color-scheme: light)" srcset="https://docs.embeddable.com/img/logos/colour-horizontal-black-transparent.png, https://docs.embeddable.com/img/logos/colour-horizontal-black-transparent@2x.png 2x">
  <img alt="Embeddable" src="https://docs.embeddable.com/img/logos/colour-horizontal-black@2x.png" width="216">
</picture>

[Embeddable](https://embeddable.com/) is a developer toolkit for building fast,
interactive, customer-facing analytics directly into your product.
Fully customize analytics dashboards using React.js, and seamlessly
integrate them anywhere with Web Components.

Discover more about Embeddable by reading our [Docs](https://docs.embeddable.com/),
[Customer Stories](https://embeddable.com/customer-stories), and [Blog](https://embeddable.com/blog).
