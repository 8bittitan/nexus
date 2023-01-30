import type { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { authenticator } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/library',
  });
};

export default function Index() {
  return (
    <section className="max-h-fit p-12">
      <div className="text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-5xl font-bold">Welcome to Nexus!</h1>
          <p className="py-6 text-lg">
            The one stop shop for tracking your installed games, and finding new
            ones to play!
          </p>
          <Link
            to="/auth/steam"
            className="bg-slate-600 text-slate-50 hover:bg-slate-700 transition-colors rounded-md px-4 py-2 shadow-md"
          >
            Sign in with Steam
          </Link>
        </div>
      </div>
    </section>
  );
}
