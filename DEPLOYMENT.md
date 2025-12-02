# Deployment Information

This readme collects various information relevant to contributors with deployment access.

For general contributing guides, please reference the main [readme file](README.md).

## Build Cache

To avoid caching issues in Vercel we have set this environment variable in the Vercel platform:

`VERCEL_FORCE_NO_BUILD_CACHE` to true

## Testing For Broken Links

Use a tool like https://www.deadlinkchecker.com/

## Sidebar Caching Issues

Sometimes, the left sidebar is cached, causing strange behavior when deploying.

When deploying:

- Go to Vercel.
- You'll see your branch.
- Click three dots.
- Select latest deployment.
- In the top right, click the three dots.
- Click Redeploy.
- Make sure 'use existing build cache' is unticked.
