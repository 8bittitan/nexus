import { Authenticator } from 'remix-auth';
import { SteamStrategy } from 'remix-auth-steam';
import type { UserSession } from '~/types';

import { sessionStorage } from './session.server';
import { findOrCreateByProfile } from '~/models/user.server';
import env from '~/utils/env.server';

const authenticator = new Authenticator<UserSession | null>(sessionStorage);

authenticator.use(
  new SteamStrategy(
    {
      returnURL: env.STEAM_RETURN_URL,
      apiKey: env.STEAM_API_KEY,
    },
    async (steamDetails) => {
      const user = await findOrCreateByProfile(steamDetails);

      return user;
    },
  ),
);

export { authenticator };
