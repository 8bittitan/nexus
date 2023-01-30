import type { Profile } from '@prisma/client';
import type {
  AlgoliaGame,
  GameDetails,
  GameWithDetails,
  Genre,
  PossibleGameDetails,
} from '~/types';
import type { SearchIndex } from 'algoliasearch';
import SteamAPI from 'steamapi';
import algoliasearch from 'algoliasearch';
import * as Sentry from '@sentry/remix';

import { createManyGames } from './models/game.server';
import env from './utils/env.server';

const algolia = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_API_KEY);

class Importer {
  private steamApi: SteamAPI;
  private profile: Profile;
  private algolia: SearchIndex;

  constructor(profile: Profile) {
    this.profile = profile;
    this.steamApi = new SteamAPI(env.STEAM_API_KEY);
    this.algolia = algolia.initIndex(env.ALGOLIA_SEARCH_INDEX);
  }

  private async getUserGames() {
    const userGames = await this.steamApi.getUserOwnedGames(
      this.profile.providerId,
    );

    return userGames.sort((a, b) => b.playTime - a.playTime);
  }

  private async getGameDetails(
    game: SteamAPI.Game,
  ): Promise<[SteamAPI.Game, PossibleGameDetails]> {
    try {
      const gameId = game.appID.toString();

      const gameDetails = (await this.steamApi.getGameDetails(
        gameId,
      )) as GameDetails;

      return [game, gameDetails];
    } catch (err) {
      Sentry.captureException(err, {
        user: {
          id: this.profile.userId,
        },
        extra: {
          gameId: game.appID,
        },
      });
      return [game, null];
    }
  }

  private processGameData(game: SteamAPI.Game, details: GameDetails) {
    const developers = details.developers.join(',');
    const publishers = details.publishers.join(',');
    const genres = details.genres
      .map((genre: Genre) => genre.description)
      .join(',');

    return {
      developers,
      publishers,
      genres,
      name: game.name,
      steamId: game.appID.toString(),
      playtime: game.playTime,
      description: details.about_the_game as string,
      image: details.header_image as string,
      userId: this.profile.userId,
    };
  }

  private async putGamesToDatabase(games: GameWithDetails[]) {
    const processedGames = games.map(([game, details]) =>
      this.processGameData(game, details),
    );

    await createManyGames(processedGames);
  }

  private putObjectID([game, gameDetails]: GameWithDetails): AlgoliaGame {
    return {
      ...gameDetails,
      objectID: game.appID.toString(),
    };
  }

  public async import() {
    try {
      const userGames = await this.getUserGames();

      const gamesWithDetails = await Promise.all(
        userGames.map((game) => this.getGameDetails(game)),
      );

      const filteredGames = gamesWithDetails.filter(([_, gameDetails]) =>
        Boolean(gameDetails),
      ) as GameWithDetails[];

      await this.putGamesToDatabase(filteredGames);

      const gamesForAlgolia = filteredGames.map(this.putObjectID);
      await this.algolia.saveObjects(gamesForAlgolia);
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}

export default Importer;
