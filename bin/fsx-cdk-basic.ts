#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FsxCdkBasicStack } from '../lib/fsx-cdk-basic-stack';

const app = new cdk.App();
new FsxCdkBasicStack(app, 'FsxCdkBasicStack', {
    env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
    },
});
