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

export const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__next_theme',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
  },
});

export async function getThemeSession(request: Request): Promise<Theme> {
  let session = await themeSessionStorage.getSession(
    request.headers.get('Cookie'),
  );
  return session.get('theme') ?? 'dark';
}
