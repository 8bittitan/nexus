import type { SteamStrategyVerifyParams } from 'remix-auth-steam';
import type { UserSession } from '@types';

import { prisma } from '~/utils/db.server';

export const findOrCreateByProfile = async (
  steamUser: SteamStrategyVerifyParams,
): Promise<UserSession | null> => {
  try {
    const { realName, avatar, nickname, steamID } = steamUser;

    const existingProfile = await prisma.profile.findFirst({
      where: { providerId: steamID, providerName: 'Steam' },
    });

    if (existingProfile) {
      return {
        userId: existingProfile.userId,
        profileId: existingProfile.id,
        displayName: existingProfile.displayName,
        name: existingProfile.name,
        avatar: existingProfile.avatar,
      };
    }

    const newUser = await prisma.user.create({
      data: {},
    });

    const newProfile = await prisma.profile.create({
      data: {
        userId: newUser.id,
        providerName: 'Steam',
        providerId: steamID,
        displayName: nickname,
        name: realName,
        avatar: avatar.medium,
      },
    });

    return {
      userId: newProfile.userId,
      profileId: newProfile.id,
      displayName: newProfile.displayName,
      name: newProfile.name,
      avatar: newProfile.avatar,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
