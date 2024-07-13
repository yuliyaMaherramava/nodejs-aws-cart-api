#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartServiceStack } from '../lib/cart-service-stack';
import 'dotenv/config';

const app = new cdk.App();
new CartServiceStack(app, 'CartServiceStack', {
  env: {
    account: process.env.CDK_ACCOUNT_ID,
    region: process.env.CDK_REGION,
  },
});
