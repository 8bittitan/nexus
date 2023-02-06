import type { Game } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import type { AlgoliaGame } from '~/types';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import DOMPurify from 'dompurify';
import recommend from '@algolia/recommend';
import * as Sentry from '@sentry/remix';

import { gameById } from '~/models/game.server';
import env from '~/utils/env.server';
import { requiresUser } from '~/http.server';

type LoaderData = {
  game: Game;
  relatedGames: AlgoliaGame[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requiresUser(request);

  const gameId = params.gameId as string;

  const game = await gameById(gameId, user.userId);

  if (!game) {
    return redirect('/library');
  }

  let relatedGames: AlgoliaGame[] = [];

  try {
    const recommendClient = recommend(env.ALGOLIA_APP_ID, env.ALGOLIA_API_KEY);

    const { results } = await recommendClient.getRelatedProducts<AlgoliaGame>([
      {
        indexName: env.ALGOLIA_SEARCH_INDEX,
        objectID: game.steamId,
        maxRecommendations: 3,
      },
    ]);

    relatedGames = results[0].hits;
  } catch (err) {
    Sentry.captureException(err);
    relatedGames = [];
  }

  return {
    game,
    relatedGames,
  };
};

const GamePage = () => {
  const { game, relatedGames } = useLoaderData<LoaderData>();

  return (
    <section className="pb-8">
      <div className="grid grid-cols-[4fr_1fr] gap-8">
        <div>
          <img src={game.image} className="w-full mb-8 rounded-md" alt="" />
          <div className="prose prose-slate dark:prose-invert">
            <h2 className="font-semibold text-4xl">{game.name}</h2>
            <small className="text-sm font-semibold text-sky-500 dark:text-sky-400 mb-8 block">
              {game.genres.split(',').join(' - ')}
            </small>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(game.description),
              }}
            />
          </div>
        </div>
        <div>
          <div>
            <div>
              <strong className="mb-2">Developers</strong>
              <p className="mb-8">{game.developers.split(',').join(', ')}</p>
              <strong className="mb-2">Publishers</strong>
              <p>{game.publishers.split(',').join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
      {relatedGames.length > 0 && (
        <div className="mt-32">
          <h3 className="text-center text-xl text-slate-900 dark:text-slate-50 mb-4">
            Recommended Games
          </h3>
          <div className="grid grid-cols-3 gap-8">
            {relatedGames.map((game) => (
              <article
                key={game.objectID}
                className="prose prose-slate dark:prose-invert flex flex-col"
              >
                <img
                  className="aspect-auto mb-4 rounded-md"
                  src={game.header_image}
                  alt=""
                />
                <strong className="mb-4 text-lg">{game.name}</strong>
                <p>{game.short_description}</p>
                <a
                  className="underline text-sky-600 hover:text-sky-700 dark:text-sky-500 dark:hover:text-sky-600 mt-auto"
                  href={`https://store.steampowered.com/app/${game.steam_appid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Steam
                </a>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GamePage;
