import * as cdk from "@aws-cdk/core";
import { DockerDeployStack } from "./src/stack";

// // // //

// Defines new CDK App
const app = new cdk.App();

// Instantiates the DockerDeployStack
new DockerDeployStack(app, "DockerDeployStack");
app.synth();
