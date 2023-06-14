# Phaser Test - Learning Project

Welcome to Phaser Test, a learning project aimed at creating multiplayer games with Phaser JS. This project is part of the efforts at [Amble Studio](http://amble.studio) to design tabletop games that can be played online without requiring additional software downloads. The goal is to develop online versions of tabletop games to make them accessible to a wider audience, including "non-gamers".

## Project Overview

This repository serves as a documentation and learning resource for developing the Phaser Test application. While it is primarily intended for personal use and learning purposes, it also serves to practice and improve documentation skills.

## Development Setup

To set up the development environment for Phaser Test, follow these steps:

Clone the repository:

`git clone https://github.com/haileycoop/phaser-test.git`

Install the project dependencies by running the following command in the project's root directory:

`npm install`

This will install the required dependencies for the client-side application.

## Client-side Deployment:

The client-side of the application is hosted on Netlify. To deploy changes, you will need to configure your own Netlify account and set up continuous deployment from the main branch.

## Colyseus Multiplayer Server:

The Colyseus multiplayer server will be hosted in Amazon Fargate within a Docker container. To set up the server locally for development purposes:

1. Install Docker on your computer.

2. Build the Docker image by running the following command in the project's server directory:

`docker build -t colyseus-server .`

3. Run the Docker container using the built image:

`docker run -p 2567:2567 -d colyseus-server`

This will start the Colyseus server on localhost:2567.

4. Make sure to update the necessary configuration settings within the server code to match your desired setup (e.g., database connection details, game logic, etc.).

## Deployment to Amazon Fargate:

Deployment to Amazon Fargate is managed through Terraform scripts. Before proceeding with deployment, ensure you have the necessary credentials and permissions set up in your AWS account.

To deploy the application to Amazon Fargate:

1. Install Terraform on your machine.
2. Configure the AWS credentials and region on your local machine.
3. Navigate to the terraform directory within the project.
4. Run terraform init to initialize the Terraform configuration.
5. Run terraform apply to deploy the application to Amazon Fargate.
