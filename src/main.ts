import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import 'dotenv/config';

import helmet from 'helmet';

import { AppModule } from './app.module';

// const port = process.env.PORT || 4000;

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['log', 'error'],
  });
  console.log('==============================');
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  // await app.listen(port);

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}
bootstrap().then(() => {
  console.log('App is running on %s port');
});

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(process.env);

  server = server ?? (await bootstrap());

  console.log(`server`, server);
  console.log(`DONE`);
  console.log(`Event: ${JSON.stringify(event)}`);
  console.log(`Event: ${event.body}`);
  return server(event, context, callback);
};
