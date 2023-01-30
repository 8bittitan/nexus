import { createCookieSessionStorage } from '@remix-run/node';
import type { Theme } from '~/types/theme';

import env from '~/utils/env.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
  },
});

export async function getThemeSession(request: Request): Promise<Theme> {
  let session = await sessionStorage.getSession(request.headers.get('Cookie'));
  return session.get('theme') ?? 'dark';
}
