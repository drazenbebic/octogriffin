import { faker } from '@faker-js/faker';

import prisma from '../src/lib/prisma';

const AMOUNT_TO_CREATE = 100;

async function createSeededUser(index: number) {
  return prisma.$transaction(async tx => {
    const installationId = faker.number.int({ max: 2147483647, min: 1 });

    const githubUser = await tx.githubUsers.create({
      data: {
        avatarUrl: faker.image.avatar(),
        email: faker.internet.email(),
        githubId: faker.number.int({ max: 9999999 }),
        gravatarId: '',
        htmlUrl: faker.internet.url(),
        login: faker.internet.username() + index,
        name: faker.person.fullName(),
        nodeId: faker.string.alphanumeric(20),
        type: 'User',
      },
    });

    const installation = await tx.githubInstallations.create({
      data: { githubUserId: githubUser.id, installationId },
    });

    await tx.habiticaUsers.create({
      data: {
        apiToken: faker.string.uuid(),
        githubUserId: githubUser.id,
        userId: faker.string.uuid(),
      },
    });

    const webhookLogsCreateData = Array.from(Array(100)).map(() => {
      return {
        deliveryUuid: faker.string.uuid(),
        event: faker.helpers.arrayElement([
          'installation.created',
          'installation.deleted',
          'installation.suspend',
          'installation.unsuspend',
          'package.published',
          'pull_request.closed',
          'pull_request_review.submitted',
          'push',
        ]),
        githubUserId: githubUser.id,
        hookId: faker.number.int({ max: 499999999, min: 400000000 }).toString(),
        payload: { data: 'dummy' },
        signature: `sha256=${faker.string.alphanumeric(64)}`.toLowerCase(),
      };
    });

    await tx.webhookLogs.createMany({
      data: webhookLogsCreateData,
    });

    return {
      installationId: installation.installationId,
      user: githubUser.login,
    };
  });
}

async function main() {
  for (let i = 0; i < AMOUNT_TO_CREATE; i++) {
    try {
      await createSeededUser(i);
    } catch (error) {
      console.error(`❌ Failed to create set ${i + 1}:`, error);
    }
  }
}

void main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
