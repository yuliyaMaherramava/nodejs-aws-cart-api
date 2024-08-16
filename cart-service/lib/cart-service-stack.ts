import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import 'dotenv/config';
import 'reflect-metadata';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const NestJsLambda = new Function(this, 'NestJsLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'main.handler',
      code: Code.fromAsset('../dist'),
      environment: {
        PG_HOST: process.env.PG_HOST!,
        PG_PORT: process.env.PG_PORT!,
        PG_DB: process.env.PG_DB!,
        PG_USER: process.env.PG_USER!,
        PG_PASSWORD: process.env.PG_PASSWORD!,
      },
      timeout: cdk.Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['rds:*'],
          resources: ['*'],
        }),
      ],
    });

    const restApi = new RestApi(this, 'CartApiGateway', {
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const proxyResource = restApi.root.addResource('{proxy+}', {
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    proxyResource.addMethod('ANY', new LambdaIntegration(NestJsLambda));

    new cdk.CfnOutput(this, 'CartApiUrl', { value: restApi.url || '' });
    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: NestJsLambda.functionName,
    });
    new cdk.CfnOutput(this, 'LambdaFunctionARN', {
      value: NestJsLambda.functionArn,
    });
  }
}
