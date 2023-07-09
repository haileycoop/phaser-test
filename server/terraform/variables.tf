
provider "aws" {
  region  = var.aws_region
  profile = "haileycoop"
}

variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "ap-southeast-2"
}

variable "Environment" {
  description = "The environment name"
  type        = string
  default     = "development"
}

variable "ContainerRegistryRepoName" {
  description = "The ECR Repository Name"
  type        = string
}

variable "ContainerRegistryURL" {
  description = "The ECR Repository Name"
  type        = string
}

variable "AppName" {
  description = "Name of the application"
  type        = string
}

variable "ServerPort" {
  description = "Gameplay server port weeewwww"
  type        = number
}

variable "ServerReplicas" {
  type    = number
}

variable "tags" {
  type = map(string)
}
