import type {
  ActionFunction,
  LoaderArgs,
  LinksFunction,
  SerializeFrom,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData, useTransition } from '@remix-run/react';
import { Loader2 } from 'lucide-react';
import * as Sentry from '@sentry/remix';
import type { DynamicLinksFunction } from 'remix-utils';

import { requiresUser } from '~/http.server';
import Importer from '~/importer.server';
import { gamesForUser } from '~/models/game.server';
import { getProfileForUser } from '~/models/profile.server';
import GameCard from '~/components/GameCard';
import { getCloudinaryUrl } from '~/utils/cloudinary';

export async function loader({ request }: LoaderArgs) {
  const user = await requiresUser(request);

  const games = await gamesForUser(user.userId);

  return json({
    games,
  });
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preconnect',
      href: 'https://res.cloudinary.com',
    },
  ];
};

const dynamicLinks: DynamicLinksFunction<SerializeFrom<typeof loader>> = ({
  data,
}) => {
  const preload_games = data.games.slice(0, 2);

  return preload_games.map((game) => ({
    rel: 'preload',
    href: getCloudinaryUrl(game.image, 'large'),
    as: 'image',
  }));
};

export const handle = { dynamicLinks };

export const action: ActionFunction = async ({ request }) => {
  const user = await requiresUser(request);

  const userProfile = await getProfileForUser(user);

  if (!userProfile) {
    Sentry.captureException(new Error('User imported with Steam profile'));
    return new Response('');
  }

  const importer = new Importer(userProfile);

  await importer.import();

  return new Response('');
};

export default function LibraryIndex() {
  const { games } = useLoaderData<typeof loader>();
  const transition = useTransition();

  const isSubmitting = transition.state === 'submitting';
  const hasGames = games.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-300 tracking-wide">
          Library
        </h2>
        <Form method="post">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-700 hover:bg-slate-800 text-slate-50 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-800 rounded-md px-4 py-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Import from Steam'
            )}
          </button>
        </Form>
      </div>
      {!hasGames && (
        <p className="text-lg text-center block pt-8">
          You have no games added to your library yet!
        </p>
      )}
      {hasGames && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-8">
          {games.map((game, index) => (
            <GameCard key={game.steamId} game={game} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
