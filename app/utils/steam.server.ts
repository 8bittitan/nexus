import SteamAPI from 'steamapi';

import env from '~/utils/env.server';

const steam = new SteamAPI(env.STEAM_API_KEY);

export const getUserGames = async (steamId: string) => {
  try {
    const games = await steam.getUserOwnedGames(steamId);

    games.sort((a, b) => b.playTime - a.playTime);

    console.dir(games[0]);

    await getGameDetails(games[0].appID);

    return games;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getGameDetails = async (
  appId: number,
): Promise<Record<string, unknown> | null> => {
  const appIdAsString = appId.toString();

  try {
    const game = await steam.getGameDetails(appIdAsString);

    console.dir(game);

    return game;
  } catch (err) {
    console.error(err);
    return null;
  }
};
