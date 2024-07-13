import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import 'dotenv/config';
import 'reflect-metadata';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const NestJsLambda = new Function(this, 'NestJsLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'main.handler',
      code: Code.fromAsset('../dist'),
      environment: {
        RDS_HOST: process.env.PG_HOST!,
        RDS_PORT: process.env.PG_PORT!,
        RDS_DATABASE_NAME: process.env.PG_DB!,
        RDS_USERNAME: process.env.PG_USER!,
        RDS_PASSWORD: process.env.PG_PASSWORD!,
      },
      timeout: cdk.Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          actions: ['rds-db:connect', 'rds-db:executeStatement'],
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
