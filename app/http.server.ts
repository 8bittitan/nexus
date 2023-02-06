import { redirect } from '@remix-run/node';
import * as Sentry from '@sentry/remix';

import { authenticator } from '~/utils/auth.server';

export const requiresUser = async (req: Request) => {
  try {
    const user = await authenticator.isAuthenticated(req, {
      failureRedirect: '/',
    });

    if (!user) {
      throw redirect('/');
    }

    return user;
  } catch (err) {
    Sentry.captureException(err);
    throw redirect('/');
  }
};
