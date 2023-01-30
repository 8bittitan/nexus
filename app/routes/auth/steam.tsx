import type { LoaderFunction } from '@remix-run/node';

import { authenticator } from '~/utils/auth.server';

export let loader: LoaderFunction = ({ request }) => {
  console.log(process.env.STEAM_API_KEY);

  try {
    return authenticator.authenticate('steam', request, {
      throwOnError: true,
    });
  } catch (err) {
    console.log('ERROR ENCOUNTERED');
    console.error(err);
    return {
      errors: err,
    };
  }
};
