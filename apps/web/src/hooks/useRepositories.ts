'use client';

import { startTransition, useEffect, useState } from 'react';

import { getRepositoriesAction } from '@/actions/repositories/getRepositoriesAction';
import type { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';

export const useRepositories = (): GithubSelectedRepositoriesModel[] => {
  const [repositories, setRepositories] = useState<
    GithubSelectedRepositoriesModel[]
  >([]);

  useEffect(() => {
    startTransition(async () => {
      const { data: newRepositories } = await getRepositoriesAction();
      setRepositories(newRepositories || []);
    });
  }, []);

  return repositories;
};
