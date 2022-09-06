import type SteamAPI from 'steamapi';

export type UserSession = {
  userId: string;
  profileId: string;
  displayName?: string | null;
  name?: string | null;
  avatar?: string | null;
};

export type Genre = {
  id: string;
  description: string;
};

export type SteamGame = {
  name: string;
  appID: string;
  playTime: number;
  aboutTheGame: string;
  headerImage: string;
  genres: Genre[];
  developers: String[];
  publishers: String[];
  objectID?: string;
};

type SystemRequirements = {
  minimum: string;
  recommended: string;
};

type Movie = {
  highlight: boolean;
  id: number;
  mp4: any[];
  name: string;
  thumbnail: string;
  webm: any[];
};

type Screenshot = {
  id: number;
  path_full: string;
  path_thumbnail: string;
};

export type GameDetails = {
  about_the_game: string;
  background: string;
  background_raw: string;
  categories: { description: string; id: number }[];
  detailed_description: string;
  developers: string[];
  genres: Genre[];
  header_image: string;
  is_free: boolean;
  linux_requirements: SystemRequirements;
  mac_requirements: SystemRequirements;
  movies: Movie[];
  name: string;
  // objectID: string;
  package_groups: any[];
  packages: number[];
  pc_requirements: SystemRequirements;
  platforms: { linux: boolean; mac: boolean; windows: boolean };
  publishers: string[];
  release_date: { coming_soon: boolean; date: string };
  required_age: number;
  screenshots: Screenshot[];
  short_description: string;
  steam_appid: number;
  support_info: { email: string; url: string };
  supported_languages: string;
  type: string;
  website: any;
};

export type PossibleGameDetails = GameDetails | null;

export type GameWithDetails = [SteamAPI.Game, GameDetails];

export type AlgoliaGame = GameDetails & { objectID: string };
