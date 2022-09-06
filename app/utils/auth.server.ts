import { Authenticator } from 'remix-auth';
import { SteamStrategy } from 'remix-auth-steam';
import invariant from 'tiny-invariant';
import type { UserSession } from '@types';

import { sessionStorage } from './session.server';
import { findOrCreateByProfile } from '~/models/user.server';

invariant(
  process.env.STEAM_RETURN_URL,
  'A valid Steam redirect URL is required',
);
invariant(process.env.STEAM_API_KEY, 'A valid Steam api key is required');

const authenticator = new Authenticator<UserSession | null>(sessionStorage);

authenticator.use(
  new SteamStrategy(
    {
      returnURL: process.env.STEAM_RETURN_URL,
      apiKey: process.env.STEAM_API_KEY,
    },
    async (steamDetails) => {
      const user = await findOrCreateByProfile(steamDetails);

      return user;
    },
  ),
);

export { authenticator };
