import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import SteamAPI from 'steamapi';
import algoliaSearch from 'algoliasearch';

import {
  algoliaAdminApiKey,
  algoliaAppId,
  algoliaIndexName,
  steamApiKey,
} from '~/utils/env.server';

const steam = new SteamAPI(steamApiKey);

const algolia = algoliaSearch(algoliaAppId, algoliaAdminApiKey);

const algoliaIndex = algolia.initIndex(algoliaIndexName);

function getRandomGames(games: SteamAPI.App[]) {
  const shuffled = [...games].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 20);
}

async function getGameDetails(game: SteamAPI.App) {
  try {
    return await steam.getGameDetails(game.appid.toString());
  } catch (err) {
    console.error(`Error fetching game: ${game.name}`);
    return null;
  }
}

function putObjectID(game: any) {
  return {
    ...game,
    objectID: game.steam_appid,
  };
}

export const loader: LoaderFunction = async () => {
  const games = getRandomGames(await steam.getAppList());

  const gamesWithDetails = await Promise.all(games.map(getGameDetails));

  const filteredGames = gamesWithDetails.filter(Boolean) as any[];

  const gamesForAlgolia = filteredGames.map(putObjectID);

  await algoliaIndex.saveObjects(gamesForAlgolia);

  console.log(`IMPORTED ${gamesForAlgolia.length} GAMES`);

  return json({
    games: filteredGames,
  });
};
