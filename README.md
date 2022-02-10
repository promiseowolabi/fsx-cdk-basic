# FSx ONTAP with CDK Basics!

Relies on a CF Template and CfnInclude
Creates EC2 instance and mount a volume from FSxN
- Provide preferred and standby subnet-id's

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`FsxCdkBasicStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
