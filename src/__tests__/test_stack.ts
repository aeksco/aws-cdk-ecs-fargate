import { expect as expectCDK, countResources } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { DockerDeployStack } from "../stack";

// // // //

describe("EcsWorkshopStack", () => {
  test("loads", () => {
    const app = new cdk.App();

    // Configures CDK stack
    const stack: cdk.Stack = new DockerDeployStack(app, "EcsWorkshopStack");

    // Checks stack resource count
    expectCDK(stack).to(countResources("AWS::IAM::Policy", 6));
    expectCDK(stack).to(countResources("AWS::IAM::Role", 6));
  });
});
