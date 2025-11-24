# Frontend – TypeScript Single Page Application 🎨

This folder contains the **frontend SPA** for AzureContainerDemo. It is built with **TypeScript** and a modern bundler (e.g., Vite) and is designed to be hosted as static assets (App Service, Static Web Apps, or behind a CDN).

---

## 1. Features 🚀

- TypeScript-based SPA  
- Talks to the backend via HTTPS REST APIs  
- Environment-aware API base URLs  
- Production-ready build scripts  
- Easy to containerize or host as static site  

---

## 2. Project Structure 📂

    frontend/
        src/
            components/
            pages/
            services/
            styles/
            main.tsx (or main.ts)
        public/
        index.html
        package.json
        tsconfig.json
        README.md

- `components/` – Reusable UI components  
- `pages/` – Route-level components (e.g., Dashboard, Settings)  
- `services/` – API clients / data fetch logic  
- `styles/` – Global or modular styles (CSS/SCSS/etc.)  
- `main.tsx` – Application entry point  

---

## 3. Getting Started (Local Dev) 🧑‍💻

### 3.1 Prerequisites

- Node.js (LTS)  
- npm or yarn  

### 3.2 Install Dependencies

    cd frontend
    npm install

### 3.3 Run Dev Server

    npm run dev

Common defaults:

- Dev server URL: `http://localhost:5173` or `http://localhost:3000` (depending on tooling)  

---

## 4. Build & Preview 🏭

### 4.1 Build

    npm run build

### 4.2 Preview Production Build

    npm run preview

This serves the built static assets from the `dist/` folder.

---

## 5. Environment Variables 🔐

Create a `.env.local` file (not committed) with variables like:

    VITE_API_URL=https://localhost:3000

Typical pattern:

- `VITE_API_URL` (or equivalent) points to the backend API  
- In production, this value is set via environment or host configuration  

---

## 6. API Integration 🌐

All backend calls should go through a central service file (for example in `src/services/api.ts`) that uses `VITE_API_URL` as the base URL.

Benefits:

- Easy switching between dev/test/prod  
- Central retry/error handling  
- Consistent auth headers if needed  

---

## 7. Building for Deployment ☁️

The CI/CD pipeline (Azure Pipelines) will typically:

1. Install dependencies  
2. Run tests (if defined)  
3. Build the frontend (`npm run build`)  
4. Publish the `dist/` folder as an artifact  
5. Deploy it to:
   - Azure Static Web Apps, or  
   - Azure Storage static site, or  
   - Azure App Service or container app (e.g., served by Node or as static)  

---

## 8. Testing ✅

You can add:

- Unit tests (Jest, Vitest) for components  
- Integration tests for critical flows  
- E2E tests (Cypress or Playwright)  

---

## 9. Related Documentation 📎

- Root README: `../README.md`  
- Architecture: `../docs/architecture.md`  
- Backend: `../backend/README.md`  
- Pipelines: `../docs/pipelines.md`  
