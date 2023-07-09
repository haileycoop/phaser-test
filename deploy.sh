#!/bin/bash
set -e
environment=development
startingDirectory=$PWD

# nodejs server and docker image
sh "./server/buildscripts/BuildAndPushImage.sh" "407675535910.dkr.ecr.ap-southeast-2.amazonaws.com/haileycoop/phaser-test:$environment" "407675535910.dkr.ecr.ap-southeast-2.amazonaws.com" "haileycoop" "ap-southeast-2"

cd "./server/terraform"

sh deploy.sh "$environment" $1

cd $startingDirectory