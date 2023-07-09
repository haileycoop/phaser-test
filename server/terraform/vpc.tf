resource "aws_vpc" "fargate_vpc" {
  cidr_block           = "10.10.0.0/16"
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = merge(
    var.tags,
    { Name = "${var.AppName}_vpc-${var.Environment}" }
  )
}

resource "aws_subnet" "gameplay_server" {
  cidr_block        = "10.10.1.0/24"
  vpc_id            = aws_vpc.fargate_vpc.id
  availability_zone = "${var.aws_region}a"
  tags = merge(
    var.tags,
    { Name = "${var.AppName}-${var.Environment}" }
  )
}

resource "aws_route_table" "fargate_vpc" {
  vpc_id = aws_vpc.fargate_vpc.id
  tags = merge(
    var.tags,
    { Name = "${var.AppName}_aws_route_table-${var.Environment}" }
  )
}

// Set up security groups so that the Gameplay server can access the Redis server
resource "aws_security_group" "gameplay_server" {
  name        = "${var.AppName}-${var.Environment}"
  description = "Allow remote game clients to join the gameplay server"
  vpc_id      = aws_vpc.fargate_vpc.id
  tags = merge(
    var.tags,
    { Name = "${var.AppName}-${var.Environment}" }
  )
}

resource "aws_security_group_rule" "gameplay_server_allow_game_port" {
  type              = "ingress"
  from_port         = var.ServerPort
  to_port           = var.ServerPort
  protocol          = "tcp"
  security_group_id = aws_security_group.gameplay_server.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# Allow your server to make connections to the outside Internet

resource "aws_security_group_rule" "gameplay_server_allow_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.gameplay_server.id
  cidr_blocks       = ["0.0.0.0/0"]
}


resource "aws_internet_gateway" "gameplay_server_internet_gateway" {
  vpc_id = aws_vpc.fargate_vpc.id
  tags = merge(
    var.tags,
    { Name = "${var.AppName}_aws_internet_gateway-${var.Environment}" }
  )
}

resource "aws_default_route_table" "gameplay_server_internet_gateway_route" {
  default_route_table_id = aws_vpc.fargate_vpc.default_route_table_id

  route = [
    {
      cidr_block                 = "0.0.0.0/0"
      gateway_id                 = aws_internet_gateway.gameplay_server_internet_gateway.id
      destination_prefix_list_id = null
      egress_only_gateway_id     = null
      instance_id                = null
      ipv6_cidr_block            = null
      nat_gateway_id             = null
      network_interface_id       = null
      transit_gateway_id         = null
      vpc_endpoint_id            = null
      core_network_arn           = null
      vpc_peering_connection_id  = null
    }
  ]

  tags = merge(
    var.tags,
    { Name = "${var.AppName}_aws_default_route_table-${var.Environment}" }
  )
}
