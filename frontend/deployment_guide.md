# Deployment Guide for fatloss-app

This guide provides step-by-step instructions to deploy your React + Vite application.

## Prerequisites

1.  **Git Repository**: Ensure your project is a Git repository (we just initialized this for you).
2.  **GitHub Account**: You need a GitHub account to push your code and connect to deployment services.

## Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides zero-configuration deployment for Vite apps.

1.  **Push to GitHub**:
    *   Create a new repository on [GitHub](https://github.com/new).
    *   Push your local code to GitHub:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
        git branch -M main
        git push -u origin main
        ```
2.  **Deploy on Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your GitHub repository.
    *   Vercel will detect `Vite` automatically.
    *   Click **"Deploy"**.

## Option 2: Netlify

Netlify is another excellent option with a simple drag-and-drop or Git-based workflow.

1.  **Push to GitHub** (same as above).
2.  **Deploy on Netlify**:
    *   Go to [Netlify](https://app.netlify.com/).
    *   Click **"Add new site"** -> **"Import from existing project"**.
    *   Connect to GitHub and select your repository.
    *   **Build Settings** (should be auto-detected):
        *   **Build Command**: `npm run build`
        *   **Publish directory**: `dist`
    *   Click **"Deploy"**.

## Option 3: GitHub Pages

Good for free static hosting directly from your repository.

1.  **Update `vite.config.js`**:
    *   Add `base: '/YOUR_REPO_NAME/',` to your config.
2.  **Install `gh-pages`**:
    ```bash
    npm install gh-pages --save-dev
    ```
3.  **Update `package.json`**:
    *   Add `"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",`
    *   Add scripts:
        ```json
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
        ```
4.  **Deploy**:
    ```bash
    npm run deploy
    ```

## Local Preview

To test the production build locally before deploying:

```bash
npm run build
npm run preview
```
