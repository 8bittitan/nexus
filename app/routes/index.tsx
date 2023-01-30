import type { LoaderFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

import { authenticator } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/library',
  });
};

export default function Index() {
  return (
    <section className="hero max-h-fit bg-base-200 p-12">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Nexus!</h1>
          <p className="py-6">
            The one stop shop for tracking your installed games, and finding new
            ones to play!
          </p>
          <Form action="/auth/steam">
            <button type="submit" className="btn btn-primary">
              Sign in with Steam
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}
