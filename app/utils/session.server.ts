import { createCookieSessionStorage } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { Theme } from '~/types/theme';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getThemeSession(request: Request): Promise<Theme> {
  let session = await sessionStorage.getSession(request.headers.get('Cookie'));
  return session.get('theme') ?? 'dark';
}
