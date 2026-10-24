import { releaseGithubLogin } from '@/accessors/githubUser';
import prisma from '@/lib/prisma';

type GithubInstallation = { id: number };

type GithubSender = {
  avatar_url: string;
  email?: null | string;
  gravatar_id: null | string;
  html_url: string;
  id: number;
  login: string;
  name?: null | string;
  node_id: string;
  type: string;
};

type GithubRepository = {
  full_name: string;
  id: number;
  name: string;
  node_id: string;
  private: boolean;
};

export const getGithubInstallation = (installationId: number) => {
  return prisma.githubInstallations.findUnique({
    where: { installationId: Number(installationId) },
  });
};

export const getInstallationStatus = async (
  installationId: number,
  repositoryId: number,
) => {
  const githubInstallation = await prisma.githubInstallations.findUnique({
    select: {
      selectedRepositories: {
        select: { id: true },
        take: 1,
        where: { githubRepositoryId: repositoryId },
      },
      suspended: true,
    },
    where: { installationId },
  });

  if (!githubInstallation) {
    return null;
  }

  return {
    isRepositorySelected: githubInstallation.selectedRepositories.length > 0,
    isSuspended: !!githubInstallation.suspended,
  };
};

/**
 * Resolves to `false` for an installation we don't know.
 */
export const setGithubInstallationSuspended = async (
  installationId: number,
  suspended: boolean,
) => {
  const { count } = await prisma.githubInstallations.updateMany({
    data: { suspended },
    where: { installationId },
  });

  return count > 0;
};

/**
 * Deletes an installation. Removing the app from the user's last account
 * deletes the user and everything we keep about them, too. Resolves to
 * `false` for an installation we don't know.
 */
export const deleteGithubInstallation = (installationId: bigint | number) => {
  return prisma.$transaction(async tx => {
    const githubInstallation = await tx.githubInstallations.findUnique({
      select: { githubUserId: true },
      where: { installationId: Number(installationId) },
    });

    if (!githubInstallation) {
      return false;
    }

    const { githubUserId } = githubInstallation;

    await tx.githubInstallations.delete({
      where: { installationId: Number(installationId) },
    });

    const remainingInstallations = await tx.githubInstallations.count({
      where: { githubUserId },
    });

    if (remainingInstallations === 0) {
      await tx.githubUsers.delete({ where: { id: githubUserId } });
    }

    return true;
  });
};

export const removeSelectedRepositories = (
  installationId: bigint | number,
  repositoryIds: number[],
) => {
  return prisma.githubSelectedRepositories.deleteMany({
    where: {
      githubRepositoryId: {
        in: repositoryIds,
      },
      installationId: BigInt(installationId),
    },
  });
};

export const addSelectedRepositories = (
  installationId: bigint | number,
  repositories: GithubRepository[],
) => {
  if (repositories.length === 0) {
    return Promise.resolve({ count: 0 });
  }

  return prisma.githubSelectedRepositories.createMany({
    data: repositories.map(repo => ({
      fullName: repo.full_name,
      githubRepositoryId: repo.id,
      installationId: BigInt(installationId),
      name: repo.name,
      nodeId: repo.node_id,
      private: repo.private,
    })),
    skipDuplicates: true,
  });
};

/**
 * Saves a new installation for whoever installed the app. They may already
 * have installed it on another account.
 */
export const initializeGithubInstallation = (
  installation: GithubInstallation,
  sender: GithubSender,
  repositories: GithubRepository[],
) => {
  return prisma.$transaction(async tx => {
    await releaseGithubLogin(tx, sender.login, sender.id);

    const githubUser = await tx.githubUsers.upsert({
      create: {
        avatarUrl: sender.avatar_url,
        email: sender.email,
        githubId: sender.id,
        gravatarId: sender.gravatar_id,
        htmlUrl: sender.html_url,
        login: sender.login,
        name: sender.name,
        nodeId: sender.node_id,
        type: sender.type,
      },
      update: {
        avatarUrl: sender.avatar_url,
        htmlUrl: sender.html_url,
        login: sender.login,
      },
      where: { githubId: sender.id },
    });

    const githubInstallation = await tx.githubInstallations.create({
      data: {
        githubUserId: githubUser.id,
        installationId: installation.id,
      },
    });

    if (repositories && repositories.length > 0) {
      await tx.githubSelectedRepositories.createMany({
        data: repositories.map(repository => ({
          fullName: repository.full_name,
          githubRepositoryId: repository.id,
          installationId: githubInstallation.id,
          name: repository.name,
          nodeId: repository.node_id,
          private: repository.private,
        })),
        skipDuplicates: true,
      });
    }

    return githubInstallation;
  });
};
