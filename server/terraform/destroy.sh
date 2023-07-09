#!/bin/bash
# Set up vars
environment="development"
set -e

echo "Deploying with Terraform"
terraform init
terraform workspace select "${environment}"
terraform destroy -var="Environment=${environment}" -var-file="config.tfvars" $2