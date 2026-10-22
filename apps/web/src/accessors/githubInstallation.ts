import type { Prisma } from '@/generated/prisma/client';
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

export const getGithubInstallation = async (installationId: number) => {
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

export const updateGithubInstallation = async (
  where: Prisma.GithubInstallationsWhereUniqueInput,
  data: Prisma.GithubInstallationsUncheckedUpdateInput,
) => {
  return prisma.githubInstallations.update({
    data,
    where,
  });
};

export const deleteGithubInstallation = async (
  installationId: bigint | number,
) => {
  return prisma.githubInstallations.delete({
    where: {
      installationId: Number(installationId),
    },
  });
};

export const removeSelectedRepositories = async (
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

export const addSelectedRepositories = async (
  installationId: bigint | number,
  repositories: GithubRepository[],
) => {
  if (repositories.length === 0) {
    return;
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

export const initializeGithubInstallation = async (
  installation: GithubInstallation,
  sender: GithubSender,
  repositories: GithubRepository[],
) => {
  return prisma.$transaction(async tx => {
    const githubInstallation = await tx.githubInstallations.create({
      data: {
        installationId: installation.id,
      },
    });

    await tx.githubUsers.create({
      data: {
        avatarUrl: sender.avatar_url,
        email: sender.email,
        githubId: sender.id,
        gravatarId: sender.gravatar_id,
        htmlUrl: sender.html_url,
        installationId: githubInstallation.id,
        login: sender.login,
        name: sender.name,
        nodeId: sender.node_id,
        type: sender.type,
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
