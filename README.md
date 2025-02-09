# Embeddable Handbook 

This is the repo for Embeddable's [Docs](https://docs.embeddable.com).

It uses the [Nextra](https://nextra.site) site generation framework ([Documentation](https://nextra.site/docs/guide)).

It is currently deployed and managed on [Vercel](https://vercel.com/embeddable/handbook).

Any changes pushed to the main branch are automatically deployed to https://docs.embeddable.com.


## Local Development

Install `pnpm`, e.g: `npm install -g pnpm`

Run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.

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

## License

This project is licensed under the MIT License.
