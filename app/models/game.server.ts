import type { Game } from '@prisma/client';

import { prisma } from '~/utils/db.server';

export const gamesForUser = async (userId: string): Promise<Game[]> => {
  const games = await prisma.game.findMany({
    where: {
      userId,
    },
  });
  return games;
};

export const gameById = async (
  gameId: string,
  userId: string,
): Promise<Game | null> => {
  return await prisma.game.findFirst({ where: { id: gameId, userId: userId } });
};

type CreateManyGamesInput = Omit<Game, 'user' | 'id'>[];

export const createManyGames = async (
  games: CreateManyGamesInput,
): Promise<void> => {
  try {
    await prisma.game.createMany({
      data: games,
      skipDuplicates: true,
    });
  } catch (err) {
    throw err;
  }
};
