'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

type GithubInstallation = { id: number };

type GithubSender = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  html_url: string;
  type: string;
  name?: string | null;
  email?: string | null;
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
    where: { installationId },
    select: {
      suspended: true,
      selectedRepositories: {
        where: { githubRepositoryId: repositoryId },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!githubInstallation) {
    return null;
  }

  return {
    isSuspended: !!githubInstallation.suspended,
    isRepositorySelected: githubInstallation.selectedRepositories.length > 0,
  };
};

export const updateGithubInstallation = async (
  where: Prisma.GithubInstallationsWhereUniqueInput,
  data: Prisma.GithubInstallationsUncheckedUpdateInput,
) => {
  return prisma.githubInstallations.update({
    where,
    data,
  });
};

export const deleteGithubInstallation = async (
  installationId: number | bigint,
) => {
  return prisma.githubInstallations.delete({
    where: {
      installationId: Number(installationId),
    },
  });
};

export const removeSelectedRepositories = async (
  installationId: number | bigint,
  repositoryIds: number[],
) => {
  return prisma.githubSelectedRepositories.deleteMany({
    where: {
      installationId: BigInt(installationId),
      githubRepositoryId: {
        in: repositoryIds,
      },
    },
  });
};

export const addSelectedRepositories = async (
  installationId: number | bigint,
  repositories: GithubRepository[],
) => {
  if (repositories.length === 0) return;

  return prisma.githubSelectedRepositories.createMany({
    data: repositories.map(repo => ({
      installationId: BigInt(installationId),
      githubRepositoryId: repo.id,
      nodeId: repo.node_id,
      name: repo.name,
      fullName: repo.full_name,
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
        installationId: githubInstallation.id,
        login: sender.login,
        githubId: sender.id,
        nodeId: sender.node_id,
        avatarUrl: sender.avatar_url,
        gravatarId: sender.gravatar_id,
        htmlUrl: sender.html_url,
        type: sender.type,
        name: sender.name,
        email: sender.email,
      },
    });

    if (repositories && repositories.length > 0) {
      await tx.githubSelectedRepositories.createMany({
        data: repositories.map(repository => ({
          installationId: githubInstallation.id,
          githubRepositoryId: repository.id,
          nodeId: repository.node_id,
          name: repository.name,
          fullName: repository.full_name,
          private: repository.private,
        })),
        skipDuplicates: true,
      });
    }

    return githubInstallation;
  });
};
