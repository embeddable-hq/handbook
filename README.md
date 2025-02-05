# Embeddable Handbook 

This is the repo for Embeddable's [Docs](https://docs.embeddable.com).

It uses the [Nextra](https://nextra.site) site generation framework ([Documentation](https://nextra.site/docs/guide)).

It is currently deployed and managed on [Vercel](https://vercel.com/embeddable/handbook).

Any changes pushed to the main branch are automatically deployed to https://docs.embeddable.com.


## Local Development

Install `pnpm`, e.g: `npm install -g pnpm`

Run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.

## Deploying

Sometimes, the left sidebar is cached, causing strange behaviour when deploying. 

Explanation: Nextra generates a static JSON file for the sidebar. Ensure there’s no residual .next folder persisting across builds.

Before pushing:

```bash
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm run build
pnpm run start
```

## Prepping media

**To resize videos:**

1. Convert file to .mp4: https://www.freefileconvert.com/
2. Resize it: https://ezgif.com/resize-video/ezgif-6-478b77626d11.mp4

**To resize images**

1. https://www.iloveimg.com/resize-image
2. https://compresspng.com/

## License

This project is licensed under the MIT License.
