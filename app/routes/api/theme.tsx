import type { ActionArgs } from '@remix-run/node';
import type { Theme } from '~/types/theme';

import { sessionStorage } from '~/utils/session.server';

export async function action({ request }: ActionArgs) {
  const fData = await request.formData();

  const newTheme = fData.get('theme') as Theme;

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );

  session.set('theme', newTheme);

  return new Response('', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}
