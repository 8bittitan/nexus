import type { LoaderFunction } from '@remix-run/node';

import { authenticator } from '~/utils/auth.server';

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: '/' });
};
