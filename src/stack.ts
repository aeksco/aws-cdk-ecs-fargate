import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as iam from "@aws-cdk/aws-iam";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as logs from "@aws-cdk/aws-logs";

// // // //

export class DockerDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC");

    const securityGroup = new ec2.SecurityGroup(
      this,
      "dockerDeploySecurityGroup",
      {
        allowAllOutbound: true,
        securityGroupName: "dockerDeploySecurityGroup",
        vpc: vpc
      }
    );

    securityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(8888));

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc
    });

    cluster.addDefaultCloudMapNamespace({ name: "ecslab" });

    // Adds IAM Role
    const taskrole = new iam.Role(this, "ecsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
    });

    taskrole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );

    ///////

    const dockerDeployTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "dockerDeployTaskDef",
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole: taskrole
      }
    );

    const dockerDeployLogGroup = new logs.LogGroup(
      this,
      "dockerDeployLogGroup",
      {
        logGroupName: "/ecs/dockerDeploy",
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    );

    const dockerDeployLogDriver = new ecs.AwsLogDriver({
      logGroup: dockerDeployLogGroup,
      streamPrefix: "dockerDeploy"
    });

    const dockerDeployContainer = dockerDeployTaskDefinition.addContainer(
      "dockerDeployContainer",
      {
        image: ecs.ContainerImage.fromRegistry("jupyter/scipy-notebook"),
        environment: {
          COLOR: "blue"
        },
        logging: dockerDeployLogDriver
      }
    );

    dockerDeployContainer.addPortMappings({
      containerPort: 8888
    });

    ///////

    const dockerDeployService = new ecs.FargateService(
      this,
      "dockerDeployService",
      {
        cluster: cluster,
        taskDefinition: dockerDeployTaskDefinition,
        assignPublicIp: true,
        desiredCount: 2,
        securityGroup: securityGroup,
        cloudMapOptions: {
          name: "dockerDeploy-service"
        }
      }
    );

    ///////

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, "external", {
      vpc: vpc,
      internetFacing: true
    });

    const dockerGatewayListener = loadBalancer.addListener(
      "dockerGatewayListener",
      {
        port: 80
      }
    );

    dockerGatewayListener.addTargets("dockerGatewayTargetGroup", {
      port: 80,
      healthCheck: {
        path: "/ping"
      },
      targets: [dockerDeployService]
    });

    new cdk.CfnOutput(this, "ALBDNS: ", {
      value: loadBalancer.loadBalancerDnsName
    });
  }
}
