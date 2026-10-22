'use client';

import { useMemo } from 'react';

import type { ComboboxItemType } from '@/components/ui/Combobox';
import type { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';

export const useRepositoryOptions = (
  repositories: GithubSelectedRepositoriesModel[],
): ComboboxItemType[] => {
  return useMemo(
    () =>
      repositories.map(repository => ({
        label: repository.fullName,
        value: repository.uuid,
      })),
    [repositories],
  );
};
