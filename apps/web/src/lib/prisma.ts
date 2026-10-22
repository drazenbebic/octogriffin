import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';
import { decrypt, encrypt, isEncrypted } from '@/lib/crypto';
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
      habiticaUsers: {
        async create({ args, query }) {
          if (args.data.apiToken) {
            args.data.apiToken = encrypt(args.data.apiToken);
          }

          return query(args);
        },
        async update({ args, query }) {
          if (args.data.apiToken && typeof args.data.apiToken === 'string') {
            args.data.apiToken = encrypt(args.data.apiToken);
          }

          return query(args);
        },
        async upsert({ args, query }) {
          if (args.create.apiToken) {
            args.create.apiToken = encrypt(args.create.apiToken);
          }

          if (
            args.update.apiToken &&
            typeof args.update.apiToken === 'string'
          ) {
            args.update.apiToken = encrypt(args.update.apiToken);
          }

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
