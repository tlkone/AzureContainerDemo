variable "frontend_image" {
  type        = string
  description = "Container image for frontend app"
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "backend_image" {
  type        = string
  description = "Container image for backend API"
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "deploy_template" {
  description = "If false, deploys using a public placeholder image with no ACR registry config. If true, uses ACR images and registry config."
  type        = bool
  default     = false
}
