import type { Request, Response } from 'express';
import type { Express } from 'express';
import type { INestApplication } from '@nestjs/common';

import { createApp } from './main';

type GlobalRefs = {
  __NEST_APP__?: INestApplication;
  __NEST_HANDLER__?: Express;
};

const globalRef = globalThis as unknown as GlobalRefs;

export default async function handler(
  request: Request,
  response: Response,
): Promise<void> {
  if (!globalRef.__NEST_HANDLER__) {
    process.env.SERVERLESS = 'true';
    const app = await createApp();
    await app.init();

    globalRef.__NEST_APP__ = app;
    globalRef.__NEST_HANDLER__ = app.getHttpAdapter().getInstance() as Express;
  }

  const handle = globalRef.__NEST_HANDLER__;
  handle(request, response);
}
