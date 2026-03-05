# Bing Wallpaper Gallery

## Introduction

This is the frontend branch of the [zryyyy/bing-wallpaper](https://github.com/zryyyy/bing-wallpaper) repository. It provides a modern, responsive, and elegant web gallery to showcase daily Bing wallpapers. The frontend fetches the auto-generated JSON data (such as `en-US.json`, `zh-CN.json`, etc.) from the main branch to render the daily wallpapers seamlessly.

## Tech Stack

This project is built with modern frontend technologies:

- **Core Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Code Quality:** [Biome](https://biomejs.dev/)
- **Optimization:** `babel-plugin-react-compiler`
- **Deployment**: Automated deployment to GitHub Pages via GitHub Actions

## Local Development

To get the project running locally, follow these steps:

1. **Clone the repository and switch to the frontend branch:**
```bash
git clone https://github.com/zryyyy/bing-wallpaper.git
cd bing-wallpaper
git checkout frontend
```

2. **Install dependencies:** *(Note: This will also automatically trigger the `postinstall` script to set up git hooks)*
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```
