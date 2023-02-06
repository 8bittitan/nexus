import type { LoaderFunction } from '@remix-run/node';
import * as Sentry from '@sentry/remix';

import { authenticator } from '~/utils/auth.server';

export let loader: LoaderFunction = ({ request }) => {
  try {
    return authenticator.authenticate('steam', request, {
      throwOnError: true,
    });
  } catch (err) {
    Sentry.captureException(err);
    return {
      errors: err,
    };
  }
};
