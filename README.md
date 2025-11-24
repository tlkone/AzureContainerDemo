# AzureContainerDemo – Cloud-Native Reference Application on Azure

AzureContainerDemo is a full-stack, production-style cloud application demonstrating how to design, architect, deploy, and operate modern workloads on **Microsoft Azure** using **Terraform**, **TypeScript**, **Azure Pipelines**, and cloud-native best practices.

This repository showcases real-world engineering fundamentals including:

- ✅ Infrastructure as Code (Terraform)
- ✅ Multi-stage CI/CD (Azure Pipelines)
- ✅ Modern TypeScript backend and frontend
- ✅ Secure secret management (Azure Key Vault)
- ✅ Environment isolation (dev / test / prod)
- ✅ Observability and operations (App Insights, Azure Monitor)

---

## 1. Overview 🚀

AzureContainerDemo is intentionally structured to look and feel like a real enterprise workload:

- **Infrastructure**: Terraform-managed Azure resources  
- **Backend**: Node.js + TypeScript REST API  
- **Frontend**: TypeScript SPA  
- **Pipelines**: Azure Pipelines CI/CD (build → plan → apply → deploy)  
- **Security**: Key Vault, RBAC, environment separation  
- **Observability**: Application Insights, logs, and metrics  

<div style="background-color:#0f172a; color:#e5e7eb; padding:12px 16px; border-radius:8px; margin-top:12px;">
<b>Why this repo exists</b><br/>
This is more than a demo – it is a <b>cloud engineering case study</b> showing how a senior cloud engineer structures, documents, and automates a real-world workload.
</div>

---

## 2. Architecture 🏗️

### 2.1 High-Level Diagram (GitHub-Safe Mermaid)

~~~mermaid
flowchart LR
    Frontend[SPA Frontend]
    Backend[Backend API]
    Storage[(Storage or Database)]
    KeyVault[(Azure Key Vault)]
    Insights[(Azure App Insights)]

    Frontend -->|HTTPS / REST| Backend
    Backend -->|Read / Write| Storage
    Backend -->|Secrets| KeyVault
    Backend -->|Logs / Metrics| Insights
~~~

### 2.2 Architecture Features

- Stateless **backend API**
- Static **SPA frontend** optimized for fast delivery
- **Terraform-provisioned** Azure resource groups, networking, and compute
- **Azure Key Vault** for centralized secret and key management
- **Application Insights** and **Azure Monitor** for telemetry and diagnostics
- Cloud-native, **modular and scalable** design patterns

👉 Detailed architecture documentation:  
`docs/architecture.md`

---

## 3. Repository Structure 📂

~~~text
AzureContainerDemo/
├─ .azure-pipelines/     CI/CD pipelines (build, plan, apply, deploy)
├─ backend/              Node.js + TypeScript REST API
├─ frontend/             TypeScript SPA
├─ infra/                Terraform infrastructure-as-code
└─ docs/                 Architecture, pipelines, infra, and operations docs
~~~

Each main folder includes its own README to help new contributors ramp quickly.

<div style="background-color:#ecfdf5; color:#022c22; padding:10px 14px; border-radius:6px; margin-top:10px; border:1px solid #6ee7b7;">
<b>Tip:</b> Treat each folder like its own mini-project with entry docs, consistent naming, and repeatable commands.
</div>

---

## 4. Infrastructure (Terraform) 🧱

Terraform is used to provision Azure resources in a **repeatable**, **environment-driven**, and **version-controlled** way.

### 4.1 Key Features

- Remote Terraform state stored in **Azure Storage** (with versioning and soft-delete)
- Separate `dev`, `test`, and `prod` configurations via `*.tfvars` files
- **RBAC** and identity-driven access controls
- Integration with **Azure Key Vault** for secret retrieval
- Idempotent, **CI/CD-driven** deployments

### 4.2 Common Commands

**Initialize Terraform:**

~~~bash
cd infra
terraform init
~~~

**Generate a plan:**

~~~bash
terraform plan -var-file=env/dev.tfvars
~~~

**Apply changes:**

~~~bash
terraform apply -var-file=env/dev.tfvars
~~~

More details:  
`docs/infra-terraform.md`

---

## 5. Backend (Node.js + TypeScript) ⚙️

The backend is a lightweight, cloud-ready REST API built with **Node.js + TypeScript**, designed for deployment on **Azure App Service** or **Azure Container Apps**.

### 5.1 Local Development

~~~bash
cd backend
npm install
npm run dev
~~~

### 5.2 Build and Run

~~~bash
npm run build
npm start
~~~

### 5.3 Environment Variables

Create a `.env.local` file (excluded from Git) such as:

~~~env
PORT=3000
KEYVAULT_URI=https://your-key-vault.vault.azure.net/
API_KEY=your-api-key
~~~

The backend follows a clean layered structure (routes → controllers → services) to keep business logic organized and testable.

More details:  
`docs/backend.md`

---

## 6. Frontend (TypeScript SPA) 🎨

The frontend is a modern **Single Page Application** built using **TypeScript** and a lightweight bundler.

### 6.1 Local Development

~~~bash
cd frontend
npm install
npm run dev
~~~

### 6.2 Build and Preview

~~~bash
npm run build
npm run preview
~~~

### 6.3 Example `.env.local`

~~~env
VITE_API_URL=https://localhost:3000
~~~

The SPA is designed to communicate with the backend over HTTPS using environment-specific API base URLs.

More details:  
`docs/frontend.md`

---

## 7. CI/CD with Azure Pipelines 🔁

A multi-stage **Azure Pipelines** configuration orchestrates build, infrastructure provisioning, and application deployment.

### 7.1 CI Pipeline (Build)

The CI pipeline typically:

- Installs Node.js  
- Restores and installs dependencies  
- Builds the **backend** and **frontend**  
- Runs unit tests (if configured)  
- Publishes build artifacts for deployment  

### 7.2 CD Pipeline (Deploy)

The CD pipeline usually:

1. Runs **Terraform Plan**  
2. Requires **manual approval** for infrastructure changes  
3. Executes **Terraform Apply**  
4. Deploys the **backend** to Azure  
5. Deploys the **frontend** to static hosting / app service  
6. Promotes changes through **dev → test → prod** environments  

More details:  
`docs/pipelines.md`

---

## 8. Observability and Operations 📊

Operations and reliability are treated as first-class responsibilities.

### 8.1 Monitoring

- **Application Insights** for request logs, traces, and metrics  
- **Dependency tracking** for outbound calls  
- **Exception tracking** for error diagnosis  
- **Live Metrics Stream** for real-time behavior  

### 8.2 Recommended Alerts

- High overall **error rate**  
- **Latency** above target thresholds  
- **CPU / memory** saturation for compute resources  
- Sudden spike in **5xx** responses  

### 8.3 Scaling

- Configure **App Service autoscale** rules (e.g., based on CPU or HTTP queue length)  
- For Container Apps, use **KEDA-based** scaling (e.g., HTTP concurrency, queue length)  

### 8.4 Rollback Strategies

- Re-deploy a **previous artifact** from Azure Pipelines  
- Use **App Service deployment slots** and swap back to the last known good version  
- Restore a **previous Terraform state** if an infra change regressed behavior  
- Use **database or storage snapshots** for data-related recovery (where appropriate)  

More details:  
`docs/operations.md`

---

## 9. Security Considerations 🔐

AzureContainerDemo is designed with a **secure-by-default** mindset:

- No secrets committed to Git or stored in plain text  
- All sensitive values retrieved from **Azure Key Vault**  
- Use of **Managed Identities** is recommended wherever possible  
- **HTTPS-only** for all public entry points  
- **RBAC** enforced on Terraform state and Azure resources  
- Strict **environment isolation** (dev, test, prod)  

---

## 10. Roadmap 🛣️

Planned improvements and nice-to-haves:

- Add **OpenAPI / Swagger** documentation for the backend  
- Add **end-to-end tests** using Cypress or Playwright  
- Add **Application Insights Workbooks** and dashboard examples  
- Implement **Blue/Green** or **Canary** deployment strategies  
- Add **Virtual Network** integration and private endpoints  
- Introduce **CDN-backed, versioned frontend** deployment  

---

## 11. Contributing 🤝

Contributions are welcome, especially those that improve clarity, quality, or real-world applicability.

1. Fork the repository  
2. Create a feature branch  
3. Make your changes and add tests where appropriate  
4. Submit a pull request with a clear description and context  

If you are using this repo as a portfolio piece, feel free to adapt the docs to match your environment and storytelling.

---

## 12. License 📄

This project is licensed under the **MIT License**.  
See the `LICENSE` file for full details.

---

<div style="background-color:#eff6ff; color:#1e3a8a; padding:12px 16px; border-radius:8px; border:1px solid #bfdbfe; margin-top:16px;">
<b>Summary:</b> PSP2 is meant to look and feel like a real production workload – with Terraform, CI/CD, secret management, observability, and clean documentation – so that it stands out on GitHub and in interviews as a serious cloud engineering project.
</div>
