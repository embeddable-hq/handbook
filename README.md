# Embeddable Handbook

This is the repo for Embeddable's [Docs](https://docs.embeddable.com).

It uses the [Nextra](https://nextra.site) site generation framework ([Documentation](https://nextra.site/docs/guide)).

It is currently deployed and managed on [Vercel](https://vercel.com/embeddable/handbook).

Any changes pushed to the main branch are automatically deployed to https://docs.embeddable.com.

## Documentation Guidelines

### Writing

- Please follow our **[style guide](https://www.notion.so/trevorio/Handbook-Guidelines-256726382bcf8078882bda58242bb6d7)**

### Structure

- Keep nesting no more than two levels deep (e.g. Connect your data > Integrations > Cube Cloud).
- Avoid using dropdowns as pages. They can be tricky to navigate, especially on mobile.

## Clone repo

Use `git clone git@github.com:embeddable-hq/handbook.git`

Troubleshooting:

- You may need to [generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [add the SSH key to your github account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

## Local Development

Install `pnpm`, e.g: `npm install -g pnpm`

Run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit `https://localhost:3000`.

## Remove Cookie banner

The cookie banner will constantly appear.

Hack to fix this:

- in `_document.tsx` update line 16 to be: `})(window,document,'script','dataLayer','DO-NOT-COMMIT');`

## Git UI

These are popular git UI tools:

- [Github Desktop](https://github.com/desktop/desktop)
- [Sourcetree](https://www.sourcetreeapp.com/)

## Testing final app

Run `pnpm build` to build the app

Run `pnpm run start` to preview the built app

## Deploying

Sometimes, the left sidebar is cached, causing strange behaviour when deploying.

When deploying:

- Go to Vercel.
- You'll see your branch.
- Click three dots.
- Select latest deployment.
- In the top right, click the three dots.
- Click Redeploy.
- Make sure 'use existing build cache' is unticked.

## Prepping media

- Resize to max 1250px width for videos and images.

**To resize videos:**

1. Convert file to .mp4: https://www.freefileconvert.com/
2. Resize it: https://ezgif.com/resize-video/ezgif-6-478b77626d11.mp4

**To resize images**

1. https://www.iloveimg.com/resize-image
2. https://compresspng.com/

## To avoid caching issues in Vercel

We have set this environment variable in the Vercel platform:

VERCEL_FORCE_NO_BUILD_CACHE to true

## To test for broken links

Use a tool like https://www.deadlinkchecker.com/

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
