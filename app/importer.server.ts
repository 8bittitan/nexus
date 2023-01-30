import type { Profile } from '@prisma/client';
import type {
  AlgoliaGame,
  GameDetails,
  GameWithDetails,
  Genre,
  PossibleGameDetails,
} from '@types';
import type { SearchIndex } from 'algoliasearch';
import SteamAPI from 'steamapi';
import algoliasearch from 'algoliasearch';

import { createManyGames } from './models/game.server';
import {
  steamApiKey,
  algoliaAdminApiKey,
  algoliaAppId,
  algoliaIndexName,
} from './utils/env.server';

const algolia = algoliasearch(algoliaAppId, algoliaAdminApiKey);

class Importer {
  private steamApi: SteamAPI;
  private profile: Profile;
  private algolia: SearchIndex;

  constructor(profile: Profile) {
    this.profile = profile;
    this.steamApi = new SteamAPI(steamApiKey);
    this.algolia = algolia.initIndex(algoliaIndexName);
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
      console.error(`Could not get game: ${game.appID}`);
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
      console.log('FETCHING USER GAMES');
      const userGames = await this.getUserGames();
      console.log('COMPLETE FETCHING USER GAMES');

      console.log('FETCHING GAME DETAILS');
      const gamesWithDetails = await Promise.all(
        userGames.map((game) => this.getGameDetails(game)),
      );
      console.log('COMPLETE FETCHING GAME DETAILS');

      const filteredGames = gamesWithDetails.filter(([_, gameDetails]) =>
        Boolean(gameDetails),
      ) as GameWithDetails[];

      console.log('PUTTING GAMES TO DATABASE');
      await this.putGamesToDatabase(filteredGames);
      console.log('COMPLETE PUTTING GAMES TO DATABASE');

      console.log('PUSHING IMPORTED GAMES TO ALGOLIA');
      const gamesForAlgolia = filteredGames.map(this.putObjectID);
      await this.algolia.saveObjects(gamesForAlgolia);
      console.log('FINISHED PUSHING IMPORTED GAMES TO ALGOLIA');

      console.log('Games imported successfully');
    } catch (err) {
      console.error(`ERROR IMPORTING GAMES: ${err}`);
    }
  }
}

export default Importer;
