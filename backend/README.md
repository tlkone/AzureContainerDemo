# Backend – Node.js + TypeScript API ⚙️

This folder contains the **backend REST API** for the AzureContainerDemo application. It is built with **Node.js + TypeScript** and is designed to run on **Azure App Service** or **Azure Container Apps**.

---

## 1. Features 🚀

- Built with TypeScript for strong typing  
- REST API architecture  
- Clean layered structure (routes → controllers → services)  
- Environment-based configuration  
- Integrates with Azure Key Vault for secrets  
- Production-ready build pipeline  

---

## 2. Project Structure 📂

    backend/
        src/
            routes/
            controllers/
            services/
            middleware/
            index.ts
        dist/
        package.json
        tsconfig.json
        README.md

- `src/` – TypeScript source code  
- `routes/` – Defines HTTP endpoints and maps them to controllers  
- `controllers/` – Request/response handlers  
- `services/` – Core business logic and integrations  
- `middleware/` – Cross-cutting concerns (logging, validation, auth, etc.)  
- `index.ts` – Application entry point  
- `dist/` – Compiled JavaScript output  

---

## 3. Getting Started (Local Dev) 🧑‍💻

### 3.1 Prerequisites

- Node.js (LTS)  
- npm or yarn  
- (Optional) Azure CLI, if testing with live Azure resources  

### 3.2 Install Dependencies

    cd backend
    npm install

### 3.3 Run in Development Mode

    npm run dev

This typically starts the API at:

- URL: `http://localhost:3000` (or as configured in your env variables)

---

## 4. Build and Run (Production) 🏭

### 4.1 Build

    npm run build

### 4.2 Run Compiled Output

    npm start

This runs the compiled code from the `dist/` folder.

---

## 5. Configuration & Environment Variables 🔐

Create a `.env.local` file (never commit this file) with variables such as:

    PORT=3000
    NODE_ENV=development
    KEYVAULT_URI=https://your-key-vault.vault.azure.net/
    APPINSIGHTS_CONNECTION_STRING=YOUR_CONNECTION_STRING

Environment variables are typically injected via:

- Local `.env.local` during development  
- Azure App Service or Container Apps **Application Settings** in the cloud  

---

## 6. Logging & Telemetry 📊

The backend is designed to integrate with:

- **Azure Application Insights** for requests, dependencies, and exceptions  
- Console logging for local development and container logs  

You can extend logging by adding middleware in `middleware/` to:

- Log request IDs and correlation IDs  
- Attach user or tenant context  

---

## 7. Testing ✅

Add tests under a `tests/` or `__tests__/` folder (depending on your chosen framework).

Example patterns:

- Unit tests for services  
- Integration tests for routes/controllers  

Recommended frameworks (pick one):

- Jest  
- Mocha + Chai  
- Vitest  

---

## 8. Deployment Notes ☁️

The CI/CD pipeline will typically:

1. Restore dependencies  
2. Run tests  
3. Build the TypeScript project  
4. Publish artifacts (e.g., `dist/` + `package.json`)  
5. Deploy to Azure App Service or Azure Container Apps  

Configuration differences between environments (dev/test/prod) are handled via environment variables and Azure configuration, not by changing code.

---

## 9. Related Documentation 📎

- Root architecture: `../docs/architecture.md`  
- Infra (Terraform): `../docs/infra-terraform.md`  
- Pipelines: `../docs/pipelines.md`  
- Frontend: `../frontend/README.md`  
