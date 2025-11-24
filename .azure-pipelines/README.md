# Azure Pipelines – CI/CD 🔁

This folder contains the **Azure Pipeline YAML definitions** that build, test, provision, and deploy the AzureContainerDemo application.

---

## 1. Purpose 🎯

- Standardize build and deployment across environments  
- Automate Terraform (plan/apply) steps  
- Build and deploy backend and frontend artifacts  
- Enforce manual approvals for critical changes  

---

## 2. Typical Layout 📂

    .azure-pipelines/
        infra.yaml
        README.md


---

## 3. CI Pipeline (Build) 🧪

Common responsibilities:

- Checkout code  
- Install Node.js  
- Install frontend and backend dependencies  
- Run unit tests  
- Build backend and frontend  
- Publish build artifacts:

    - Backend bundle (e.g., `dist/` + `package.json`)  
    - Frontend `dist/` folder  

This pipeline is often triggered on:

- Pull requests  
- Commits to `main` or specific branches  

---

## 4. CD Pipeline (Deploy) ☁️

Common stages:

1. **Terraform Plan**  
   - Initialize Terraform  
   - Run plan for the target environment  
   - Save the plan file as an artifact  

2. **Approval Gate**  
   - Manual approval step for infra changes (especially for `prod`)  

3. **Terraform Apply**  
   - Apply the previously generated plan  

4. **Backend Deploy**  
   - Deploy backend artifact to Azure App Service or Container Apps  

5. **Frontend Deploy**  
   - Deploy frontend artifacts to chosen hosting (Static Web Apps, Storage, App Service, etc.)  

---

## 5. Environments & Variables 🌎

Use:

- Variable groups for shared settings (e.g., subscription ID, tenant ID)  
- Pipeline variables or key vault references for secrets  

Typical environments:

- `dev` → auto-deploy on main merges  
- `test` → deploy on tag or manual trigger  
- `prod` → deploy with approvals and stricter gating  

---

## 6. Best Practices ✅

- Keep pipelines declarative and readable  
- Use templates for repeated steps  
- Add quality gates (tests, lint, security scans)  
- Use separate service connections per environment  

---

## 7. Related Documentation 📎

- Root README: `../README.md`  
- Infra details: `../infra/README.md` and `../docs/infra-terraform.md`  
- Backend and frontend: `../backend/README.md`, `../frontend/README.md`  
