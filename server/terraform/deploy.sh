#!/bin/bash
# Set up vars
environment=$1
set -e

echo "Deploying with Terraform"
terraform init
terraform workspace select "${environment}"
terraform apply -var="Environment=${environment}" -var-file="config.tfvars" $2