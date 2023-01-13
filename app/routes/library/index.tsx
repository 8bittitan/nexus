import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { Game } from '@prisma/client';
import { Form, useLoaderData, useTransition } from '@remix-run/react';
import { requiresUser } from '~/http.server';
import Importer from '~/importer.server';
import { gamesForUser } from '~/models/game.server';
import { getProfileForUser } from '~/models/profile.server';
import GameCard from '~/components/GameCard';

type LoaderData = {
  games: Game[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requiresUser(request);

  const games = await gamesForUser(user.userId);

  return {
    games,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requiresUser(request);

  const userProfile = await getProfileForUser(user);

  if (!userProfile) {
    return {};
  }

  const importer = new Importer(userProfile);

  console.log('STARTING IMPORT OF GAMES');
  await importer.import();
  console.log('FINISHED IMPORT OF GAMES');

  return {};
};

export default function LibraryIndex() {
  const { games } = useLoaderData<LoaderData>();
  const transition = useTransition();

  const isSubmitting = transition.state === 'submitting';
  const hasGames = games.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-300 tracking-wide">
          Library
        </h2>
        <Form method="post">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-outline"
          >
            {isSubmitting ? 'Importing...' : 'Import from Steam'}
          </button>
        </Form>
      </div>
      {!hasGames && (
        <p className="text-lg text-center block pt-8">
          You have no games added to your library yet!
        </p>
      )}
      {hasGames && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard key={game.steamId} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
