import type { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';
import { configureApp } from './app.config';

type ExpressApp = express.Express;

const globalRef = globalThis as unknown as {
  __NEST_EXPRESS_APP__?: ExpressApp;
};

async function bootstrapServer(): Promise<ExpressApp> {
  const expressInstance = express();
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn'],
  });

  configureApp(app);
  await app.init();

  return expressInstance;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  if (!globalRef.__NEST_EXPRESS_APP__) {
    globalRef.__NEST_EXPRESS_APP__ = await bootstrapServer();
  }

  const server = globalRef.__NEST_EXPRESS_APP__;
  server(req, res);
}
