#!/bin/bash
set -e
imageName=$1
RepoURL=$2
AWSProfile=$3
AWSRegion=$4

cd ./server

if [ -d "./build" ]; then
    echo "Deleting old build folder"
   rm -rf ./build
fi

echo "Installing node modules if needed"
npm i

echo "Running npm build"
npm run build

echo "Running post build for unix"
npm run postbuild-unix

echo "building Docker container image $imageName"
docker build -f Dockerfile -t "$imageName" --platform linux/amd64 . 

cd ../

# Do auth
aws ecr get-login-password --region $AWSRegion --profile $AWSProfile | docker login --username AWS --password-stdin $RepoURL

# Push :D
echo "Pushing $imageName"
docker push "$imageName"