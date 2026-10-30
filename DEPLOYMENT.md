# StorePilot — 100% Free Public Deployment (Zero Cost, No Credit Card)

This project is configured to deploy publicly for **$0 forever** without needing a payment card, paid trial, or billing account.

---

## Option 1: GitHub Pages (Automated via GitHub Actions)
**Requirements**: A free GitHub account. No credit card required.

1. Create a new repository on [GitHub](https://github.com/new).
2. Push your project code to the repository:
   ```bash
   git init
   git add .
   git commit -m "StorePilot initial release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Click **Settings** (gear icon at the top).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the production bundle, and publish your live website at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## Option 2: Cloudflare Pages (Instant Direct Upload or Git)
**Requirements**: A free Cloudflare account. No credit card required.

### Fast Direct Upload (No Git Needed):
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) (sign up for free; no payment info requested).
2. Go to **Workers & Pages** > **Create application** > **Pages** tab.
3. Select **Upload assets**.
4. Name your project (e.g. `storepilot`).
5. Drag and drop the `dist/` folder.
6. Click **Deploy site**.
7. Your app will be live immediately on your free HTTPS subdomain: `https://storepilot.pages.dev`.

### Git-Connected Cloudflare Pages:
1. Select **Connect to Git** in Cloudflare Pages.
2. Select your repository.
3. Build configuration:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.

---

## Architecture Summary
- **Frontend**: React 19 SPA, Tailwind CSS v4, Lucide Icons.
- **Portability**: Relative asset paths (`base: './'`) allowing deployment on root domains or subdirectories.
- **Routing**: `_redirects` and `vercel.json` included for clean SPA navigation.
- **Zero-Cost Resilience**: Seamlessly operates in standalone client mode with persistent e-commerce operations when running without a dedicated server, or connects to an Express backend proxy when `VITE_API_BASE_URL` is configured.
