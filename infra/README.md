# Infrastructure – Terraform on Azure 🧱

This folder contains the **Terraform configuration** that provisions all Azure resources required by AzureContainerDemo.

---

## 1. Goals 🎯

- Declarative, version-controlled infrastructure  
- Environment isolation (dev/test/prod)  
- Secure and consistent provisioning  
- Easy to integrate into CI/CD pipelines  

---

## 2. Structure 📂

    infra/
        main.tf
        variables.tf
        env/
            dev.tfvars
            test.tfvars
            prod.tfvars
        README.md

- `main.tf` – Core resources and/or module wiring  
- `variables.tf` – Input variables   
- `env/*.tfvars` – Per-environment configurations  

---

## 3. Backend State 🔐

Terraform state is usually stored in a **remote backend** (Azure Storage) with:

- Versioning enabled  
- Soft delete enabled  
- RBAC-protected access  

Example conceptual setup (the exact values live in your config):

- Resource group: `rg-tfstate`  
- Storage account: `sttfstate...`  
- Container: `tfstate`  

---

## 4. Commands ⚙️

Always run Terraform commands from the `infra/` directory.

### 4.1 Initialize

    cd infra
    terraform init

### 4.2 Plan (Dev)

    terraform plan -var-file=env/dev.tfvars

### 4.3 Apply (Dev)

    terraform apply -var-file=env/dev.tfvars

Repeat with `test.tfvars` or `prod.tfvars` for higher environments (usually gated behind approvals in CI/CD).

---

## 5. Environments 🌎

- `dev` – Used for development and integration testing  
- `test` – QA, UAT, or pre-production  
- `prod` – Production / live environment  

Each environment gets its own:

- Resource group naming pattern  
- SKU sizes  
- Feature toggles if needed  

---

## 6. Security Considerations 🔐

- Use Managed Identities instead of secrets where possible  
- Lock down state access using Azure RBAC  
- Consider using Azure Policy for guardrails (allowed locations, SKUs, etc.)  

---

## 7. CI/CD Integration 🚀

Azure Pipelines typically:

1. Runs `terraform init`  
2. Runs `terraform plan` and stores the plan output  
3. Waits for manual approval  
4. Runs `terraform apply` with the same plan  

See `../docs/pipelines.md` for deeper pipeline details.

---

## 8. Related Documentation 📎

- Architecture: `../docs/architecture.md`  
- Pipelines: `../docs/pipelines.md`  
- Ops: `../docs/operations.md`  

