import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';
import {
  encryptApiTokens,
  refuseNestedHabiticaUserWrites,
} from '@/lib/apiTokenEncryption';
import { decrypt, isEncrypted } from '@/lib/crypto';
import logger from '@/lib/logger';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  return prisma.$extends({
    name: 'encrypt-decrypt',
    query: {
      githubUsers: {
        $allOperations({ args, query }) {
          refuseNestedHabiticaUserWrites(args);

          return query(args);
        },
      },
      habiticaUsers: {
        $allOperations({ args, query }) {
          encryptApiTokens(args);

          return query(args);
        },
      },
    },
    result: {
      habiticaUsers: {
        apiToken: {
          compute(user) {
            // Tokens saved before encryption was introduced are plain text
            if (!isEncrypted(user.apiToken)) {
              return user.apiToken;
            }

            try {
              return decrypt(user.apiToken);
            } catch (error) {
              // Usually a changed ENCRYPTION_KEY. The user has to enter the
              // token again.
              logger.error(
                { error },
                'Could not decrypt a Habitica API token.',
              );

              return '';
            }
          },
          needs: { apiToken: true },
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
