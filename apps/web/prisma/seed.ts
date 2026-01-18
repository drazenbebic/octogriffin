import { faker } from '@faker-js/faker';

import prisma from '../src/lib/prisma';

const AMOUNT_TO_CREATE = 100;

async function createSeededUser(index: number) {
  return prisma.$transaction(async tx => {
    const installationId = faker.number.int({ min: 1, max: 2147483647 });

    const installation = await tx.githubInstallations.create({
      data: { installationId },
    });

    const githubUser = await tx.githubUsers.create({
      data: {
        installationId: installation.id,
        login: faker.internet.username() + index,
        githubId: faker.number.int({ max: 9999999 }),
        nodeId: faker.string.alphanumeric(20),
        avatarUrl: faker.image.avatar(),
        gravatarId: '',
        htmlUrl: faker.internet.url(),
        type: 'User',
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });

    await tx.habiticaUsers.create({
      data: {
        githubUserId: githubUser.id,
        userId: faker.string.uuid(),
        apiToken: faker.string.uuid(),
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
        signature: `sha256=${faker.string.alphanumeric(64)}`.toLowerCase(),
        hookId: faker.number.int({ min: 400000000, max: 499999999 }).toString(),
        githubUserId: githubUser.id,
        payload: { data: 'dummy' },
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
