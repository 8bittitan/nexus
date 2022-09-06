import type { Game } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import type { AlgoliaGame } from '@types';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import DOMPurify from 'dompurify';
import recommend from '@algolia/recommend';

import { gameById } from '~/models/game.server';
import { authenticator } from '~/utils/auth.server';
import {
  algoliaIndexName,
  algoliaApiKey,
  algoliaAppId,
} from '~/utils/env.server';

type LoaderData = {
  game: Game;
  relatedGames: AlgoliaGame[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect('/login');
  }

  const gameId = params.gameId as string;

  const game = await gameById(gameId, user.userId);

  if (!game) {
    return redirect('/library');
  }

  let relatedGames: AlgoliaGame[] = [];

  try {
    const recommendClient = recommend(algoliaAppId, algoliaApiKey);

    const { results } = await recommendClient.getRelatedProducts<AlgoliaGame>([
      {
        indexName: algoliaIndexName,
        objectID: game.steamId,
        maxRecommendations: 3,
      },
    ]);

    relatedGames = results[0].hits;
  } catch (err) {
    console.error(err);
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
      <div className="grid grid-cols-[3fr_1fr] gap-8">
        <div>
          <img src={game.image} className="w-full mb-8" alt="" />
          <div className="prose">
            <h2 className="font-semibold text-4xl">{game.name}</h2>
            <small className="text-sm font-semibold text-gray-400 mb-8 block">
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
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Game details</h2>
              <strong className="mb-2">Developers</strong>
              <p className="mb-4">{game.developers.split(',').join(', ')}</p>
              <strong className="mb-2">Publishers</strong>
              <p>{game.publishers.split(',').join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
      {relatedGames.length > 0 && (
        <div className="mt-16">
          <h3 className="text-center text-xl text-white mb-4">
            Recommended Games
          </h3>
          <div className="grid grid-cols-3 gap-8">
            {relatedGames.map((game) => (
              <article key={game.objectID} className="prose">
                <img
                  className="aspect-auto mb-4"
                  src={game.header_image}
                  alt=""
                />
                <strong className="mb-4 text-lg">{game.name}</strong>
                <p>{game.short_description}</p>
                <a
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
