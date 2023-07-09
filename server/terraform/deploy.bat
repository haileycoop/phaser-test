set version=0.1.0
set environment=%1

echo "Deploying with Terraform"
terraform init
terraform workspace select "%environment%"
terraform apply -var="Environment=%environment%" -var-file="config.tfvars" %2