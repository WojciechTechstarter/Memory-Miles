

# 0) Provider and region
# tells Terrafom to deploy to aws and in frankfurt
provider "aws" {
    region = "eu-central-1"
}


#############################################
# 1) Variables to make adjustments in one place

variable "project" {
    type = string
    default "mm-mini"
    description = "Name prefix for resources"
}

# First run with a public image to test if ECS works
variable "container_image" {
    type = "string"
    default = "nginx:alpine"
    description = "Docker image to run of Fargate" 
}

# Port exposed by our container (nginx)
variable "container_port" {
    type = number
    dafault = 80
    description = "Container port to expose"
}

#############################################
# 2) Use default VPC/subnets (no customization)

# looks ups the region's default VPC
data "aws_vpc" "default" {
    default = true
}

# gets all subnets in the default VPC
data "aws subnets" "default" {
    filter {
        name = "vpc-id"
        values = [data.aws_vpc.default.id]
    }
}

#############################################
# 3) Security Group for the ALB and tasks

resource "aws_security_group" "alb_sg" {
    name        = "${var.project}-alb-sg"
    description = "ALB SG"
    vpc_id      = data.aws_vpc.default.id


# allowing HTTP from the internet to the ALB
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

# allowing ALB to talk out for the health checks
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]        
    }
}

# security groups for ECS tasks (containers)
resource "aws_security_group" "tasks_sg" {
    name        = "${var.project}-tasks-sg"
    description = "ECS tasks SG"
    vpc_id      = data.aws_vpc.default.id

# only ALB can hit containers on container_port
    ingrses {
        from_port       = var.container_port
        to_port         = var.container_port
        protocol        = "tcp"
        security_groups = [aws_security_group.alb_sg.id]
        description     = "From ALB only"
    }

# tasks (containers) can go out to the internet if needed
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks 0 ["0.0.0.0/0"]
    }
}

##########################################
# 4) ALB + Target Group + Listener

# Application Load Balancer visible to the internet
resource "aws_lb" "app_alb" {
  name               = "${var.project}-alb"       
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.default.ids  
}

resource "aws_lb_target_group" "app_tg" {
  name        = "${var.project}-tg"               # Where the ALB will forward traffic
  port        = var.container_port                # Target group port must match container port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"                              # Fargate uses "ip" target type
  health_check {                                  # Simple health check on "/"
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.app_alb.arn           # Attach listener to ALB
  port              = 80                           # Listen on HTTP 80
  protocol          = "HTTP"

  default_action {                                 # Forward everything to our target group
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

###############################################
# 5) clusters? maybe not necessary


###############################################
# 6) IAM Roles for ECS Tasks (Containers)

data "aws_iam_policy_document" "task_exec_assume_role" {     # Trust policy: allow ECS tasks to assume this role
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task_exec_role" {
  name               = "${var.project}-task-exec-role"       # Execution role (pull images / send logs)
  assume_role_policy = data.aws_iam_policy_document.task_exec_assume_role.json
}

resource "aws_iam_role_policy_attachment" "task_exec_policy" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" # Grants ECR pull, CW logs
}

################################################
# 7) CloudWatch Logs (so container outputs are logged)

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project}"       # Log group for this app
  retention_in_days = 7                           # Keep logs for a week for demo
}


################################################
# 8) Task Definition (What to run on Fargate)

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project}-td"  # Task definition name / family
  network_mode             = "awsvpc"             # Required for Fargate
  requires_compatibilities = ["FARGATE"]          # Run on Fargate
  cpu                      = "256"                # 1/4 vCPU (tiny)
  memory                   = "512"                # 512MB RAM (tiny)
  execution_role_arn       = aws_iam_role.task_exec_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = jsonencode([            # Define container(s) in JSON
    {
      name      = "app"                           # Container name
      image     = var.container_image             # Docker image to run
      essential = true                            # If this dies, the task is unhealthy
      portMappings = [{                           # Expose container_port so ALB can target it
        containerPort = var.container_port
        hostPort      = var.container_port
        protocol      = "tcp"
      }]
      logConfiguration = {                        # Send stdout/stderr to CloudWatch Logs
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = "eu-central-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

####################################################
# 9) ECS Service (keeps your task running + wires to ALB)

resource "aws_ecs_service" "app" {
  name            = "${var.project}-svc"          # Service name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1                              # Run exactly one task (enough for demo)
  launch_type     = "FARGATE"

  network_configuration {                          # Where the task runs & which SG to use
    subnets         = data.aws_subnets.default.ids # Default VPC subnets
    security_groups = [aws_security_group.tasks_sg.id]
    assign_public_ip = true                        # Give task a public IP (simplifies demo)
  }

  load_balancer {                                  # Attach the service to the ALB target group
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "app"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http_listener]     # Ensure ALB/listener exist first
}


############################################
# 10) Outputs
############################################
output "alb_dns_name" {
  description = "Open this URL in your browser"
  value       = aws_lb.app_alb.dns_name           # Your public entrypoint
}