# Bing Wallpaper Gallery

The React frontend for [Bing Wallpaper](../README.md), maintained in `web/` alongside the Go archive tools on `master`.

## Stack

React, TypeScript, Vite, Tailwind CSS, Motion, Lucide React, and Biome.

## Development

Use Node.js 24 or later. From the repository root:

```bash
npm --prefix web ci
npm --prefix web run dev
```

Alternatively, run `npm ci` and `npm run dev` inside `web/`.

Installing dependencies configures the repository's `.githooks/` directory. The pre-commit hook runs frontend checks only when staged changes include `web/`. It does not rewrite or stage files. Checks inspect the current frontend working tree, so keep it consistent with what you intend to commit. Go-only and archive-only commits do not require Node.js. Commit messages use Conventional Commits.

## Validation and Build

From the repository root:

```bash
# Formatting, lint, and TypeScript
npm --prefix web run ci

# Production output: web/dist/
npm --prefix web run build
npm --prefix web run preview
```

To apply formatting and lint fixes explicitly, use `npm --prefix web run lint:fix`.

## Data and Deployment

The browser fetches recent and monthly JSON directly from `master/img` on GitHub. This includes local development: editing the local `img/` directory does not change the gallery's data source. The Go update workflow can publish new data without a frontend rebuild.

The repository-level `deploy.yml` workflow validates frontend-related pull requests to `master` and deploys frontend-related pushes to `master`. Pull requests never deploy. Manual deployment requires selecting `master`. GitHub Pages must use GitHub Actions, and any deployment branch restrictions on the `github-pages` environment must allow `master`.

Vite's base path remains `/bing-wallpaper/`. All frontend tooling runs from `web/`; generated archive JSON outside this directory is not formatted by Biome.
