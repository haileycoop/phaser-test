data "aws_ecr_image" "game_server" {
  repository_name = "haileycoop/phaser-test"
  image_tag       = "${var.Environment}"
}

resource "aws_ecs_task_definition" "game_server" {
  family                   = "${var.AppName}-${var.Environment}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = <<DEFINITION
[
  {
    "name": "${var.AppName}_container",
    "image": "${var.ContainerRegistryURL}/${var.ContainerRegistryRepoName}:${data.aws_ecr_image.game_server.image_tag}@${data.aws_ecr_image.game_server.image_digest}",
    "essential": true,
    "portMappings": [
      {
        "protocol": "tcp",
        "containerPort": ${var.ServerPort},
        "hostPort": ${var.ServerPort}
      }
    ],
    "environment": [
      {
        "name": "PORT",
        "value": "${var.ServerPort}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/fargate/service/${var.AppName}-${var.Environment}",
        "awslogs-region": "${var.aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]
DEFINITION

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "task_logs" {
  name              = "/fargate/service/${var.AppName}-${var.Environment}"
  retention_in_days = 90
  tags              = var.tags
}

resource "aws_ecs_service" "game_server" {
  name            = "${var.AppName}-${var.Environment}"
  cluster         = aws_ecs_cluster.game_server.id
  launch_type     = "FARGATE"
  task_definition = aws_ecs_task_definition.game_server.arn
  desired_count   = var.ServerReplicas

  network_configuration {
    security_groups  = [aws_security_group.gameplay_server.id]
    subnets          = [aws_subnet.gameplay_server.id]
    assign_public_ip = true
  }

  tags                    = var.tags
  enable_ecs_managed_tags = true
  propagate_tags          = "SERVICE"

}

resource "aws_ecs_cluster" "game_server" {
  name = "Cluster_GameplayServer_${var.Environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html
resource "aws_iam_role" "execution_role" {
  name               = "${var.AppName}-${var.Environment}-ecs"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "execution_role_policy" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# creates an application role that the container/task runs as
resource "aws_iam_role" "task_role" {
  name               = "${var.AppName}-${var.Environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

# Assign game server policy to the role
resource "aws_iam_role_policy" "task_role_policy" {
  name   = "${var.AppName}-${var.Environment}"
  role   = aws_iam_role.task_role.id
  policy = data.aws_iam_policy_document.task_role_policy_document.json
}

# Define game server policy
data "aws_iam_policy_document" "task_role_policy_document" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ec2:DescribeNetworkInterfaces",
      "ecs:DescribeTasks",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "*"
    ]
  }
  # This is an example permission, if for instance you would like to allow you app access to a DynamoDB database
  #statement {
  #  actions = [
  #    "dynamodb:GetItem"
  #  ]
  #  resources = [
  #    "arn:aws:dynamodb:ap-southeast-2:<AWS account number>:table/Account-${title(var.Environment)}",
  #  ]
  #}
}
