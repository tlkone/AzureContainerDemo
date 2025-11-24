terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  # Subscription / tenant / client are picked up from ARM_* env vars
  # set by the AzureCLI@2 task.
}


# ------------------------------------------------------------
# Locals
# ------------------------------------------------------------

locals {
  location     = "eastus"
  project_name = "personal"

  standard_tags = {
    environment = "dev"
    owner       = local.project_name
    project     = local.project_name
  }

  # Public image that does NOT require ACR or auth
  placeholder_image = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

# ------------------------------------------------------------
# Core infrastructure
# ------------------------------------------------------------

resource "azurerm_resource_group" "rg" {
  name     = "rg-${local.project_name}-site"
  location = local.location
  tags     = local.standard_tags
}

resource "azurerm_log_analytics_workspace" "law" {
  name                = lower("law-${local.project_name}-site")
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.standard_tags
}

resource "azurerm_container_registry" "acr" {
  name                = lower("acr${local.project_name}site${substr(replace(azurerm_resource_group.rg.name, "-", ""), 0, 4)}")
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false
  tags                = local.standard_tags
}

resource "azurerm_storage_account" "sa" {
  name                     = lower("st${local.project_name}site${substr(replace(azurerm_resource_group.rg.name, "-", ""), 0, 6)}")
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  tags                     = local.standard_tags
}

resource "azurerm_log_analytics_solution" "containerinsights" {
  solution_name         = "ContainerInsights"
  location              = azurerm_log_analytics_workspace.law.location
  resource_group_name   = azurerm_resource_group.rg.name
  workspace_resource_id = azurerm_log_analytics_workspace.law.id
  workspace_name        = azurerm_log_analytics_workspace.law.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/ContainerInsights"
  }

  tags = local.standard_tags
}

resource "azurerm_container_app_environment" "env" {
  name                       = lower("cae-${local.project_name}-site")
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
  tags                       = local.standard_tags
}

# ------------------------------------------------------------
# User-assigned identity for ACR pulls
# ------------------------------------------------------------

resource "azurerm_user_assigned_identity" "acr_pull" {
  name                = "uai-${local.project_name}-acr-pull"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags                = local.standard_tags
}

# Give that identity AcrPull on the ACR
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.acr_pull.principal_id
}

# ------------------------------------------------------------
# Frontend Container App
# ------------------------------------------------------------

resource "azurerm_container_app" "frontend" {
  name                         = lower("ca-${local.project_name}-frontend")
  resource_group_name          = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  # Use user-assigned identity (works for both stages)
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.acr_pull.id]
  }

  ingress {
    external_enabled           = true
    target_port                = 80
    transport                  = "auto"
    allow_insecure_connections = false

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  # Only configure ACR registry when using real images (deploy_template = true)
  dynamic "registry" {
    for_each = var.deploy_template ? [1] : []

    content {
      server   = azurerm_container_registry.acr.login_server
      identity = azurerm_user_assigned_identity.acr_pull.id
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name  = "frontend"
      image = var.deploy_template ? var.frontend_image : local.placeholder_image
      cpu   = 0.25
      memory = "0.5Gi"
    }
  }

  tags = local.standard_tags
}

# ------------------------------------------------------------
# Backend Container App
# ------------------------------------------------------------

resource "azurerm_container_app" "backend" {
  name                         = lower("ca-${local.project_name}-backend")
  resource_group_name          = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.acr_pull.id]
  }

  ingress {
    external_enabled           = true
    target_port                = 3000
    transport                  = "auto"
    allow_insecure_connections = false

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  dynamic "registry" {
    for_each = var.deploy_template ? [1] : []

    content {
      server   = azurerm_container_registry.acr.login_server
      identity = azurerm_user_assigned_identity.acr_pull.id
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name  = "backend"
      image = var.deploy_template ? var.backend_image : local.placeholder_image
      cpu   = 0.25
      memory = "0.5Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }

  tags = local.standard_tags
}
