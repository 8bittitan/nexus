require('dotenv').config();
const SteamAPI = require('steamapi');
const algoliaSearch = require('algoliasearch');

const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const algoliaAppId = process.env.ALGOLIA_APP_ID;
const algoliaIndexName = process.env.ALGOLIA_SEARCH_INDEX;
const steamApiKey = process.env.STEAM_API_KEY;

const steam = new SteamAPI(steamApiKey);

const algolia = algoliaSearch(algoliaAppId, algoliaAdminApiKey);

const algoliaIndex = algolia.initIndex(algoliaIndexName);

function getRandomGames(games) {
  const shuffled = [...games].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 100);
}

async function getGameDetails(game) {
  try {
    return await steam.getGameDetails(game.appid.toString());
  } catch (err) {
    console.error(`Error fetching game: ${game.name}`);
    return null;
  }
}

function putObjectID(game) {
  return {
    ...game,
    objectID: game.steam_appid,
  };
}

async function importGames() {
  try {
    const games = getRandomGames(await steam.getAppList());

    const gamesWithDetails = await Promise.all(games.map(getGameDetails));

    const filteredGames = gamesWithDetails.filter(Boolean);

    const gamesForAlgolia = filteredGames.map(putObjectID);

    await algoliaIndex.saveObjects(gamesForAlgolia);

    console.log(`IMPORTED ${gamesForAlgolia.length} GAMES`);
  } catch (err) {
    console.error(err);
  }
}

const go = async () => {
  await importGames();
  setInterval(async () => {
    await importGames();
  }, 30000);
};

go();
