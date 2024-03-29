import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToPipeableStream } from 'react-dom/server';
import * as Sentry from '@sentry/remix';
import { PassThrough } from 'stream';
import { Response } from '@remix-run/node';

import { prisma } from '~/utils/db.server';
import env from '~/utils/env.server';
import isbot from 'isbot';

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1,
  integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  environment: env.NODE_ENV,
});

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (err: unknown) => {
          didError = true;

          Sentry.captureException(err);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
