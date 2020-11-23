# aws-pdf-textract-pipeline

:mag: Experiment for deploying a Docker container using AWS Elastic Container Service and AWS Fargate. Built with AWS CDK + TypeScript.

**Getting Started**

NOTE - this is just an experimental repository and should not be used as a reference.

Run the following commands to install dependencies, build the CDK stack, and deploy the CDK Stack to AWS.

```
yarn install
yarn build
cdk bootstrap
cdk deploy
```

### Scripts

- `yarn install` - installs dependencies
- `yarn build` - builds the production-ready CDK Stack
- `yarn test` - runs Jest
- `cdk bootstrap` - bootstraps AWS Cloudformation for your CDK deploy
- `cdk deploy` - deploys the CDK stack to AWS

**Notes**

- Recommended to use `Visual Studio Code` with the `Format on Save` setting turned on.

**Built with**

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io)
- [Puppeteer](https://jestjs.io)
- [AWS CDK](https://aws.amazon.com/cdk/)

**Additional Resources**

- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
- [CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
- [CDK Assertion Package](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/assert)
- [awesome-cdk repo](https://github.com/eladb/awesome-cdk)

**License**

Opens source under the MIT License.

Built with :heart: by [aeksco](https://twitter.com/aeksco)
