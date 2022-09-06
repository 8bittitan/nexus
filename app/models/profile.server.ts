import type { UserSession } from '@types';
import type { Profile } from '@prisma/client';

import { prisma } from '~/utils/db.server';

export const getProfileForUser = async (
  user: UserSession,
): Promise<Profile | null> => {
  try {
    return await prisma.profile.findUniqueOrThrow({
      where: {
        id: user.profileId,
      },
    });
  } catch (err) {
    throw err;
  }
};
