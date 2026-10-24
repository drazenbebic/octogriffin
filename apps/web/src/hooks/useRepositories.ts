'use client';

import { useEffect } from 'react';

import { create } from 'zustand';

import { getRepositoriesAction } from '@/actions/repositories/getRepositoriesAction';
import type { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';

type RepositoriesState = {
  hasLoaded: boolean;
  isLoading: boolean;
  repositories: GithubSelectedRepositoriesModel[];
};

// One shared list, so the dashboard, its summary and the trigger dialog
// don't each fetch the same repositories
const useRepositoriesStore = create<RepositoriesState>(() => ({
  hasLoaded: false,
  isLoading: false,
  repositories: [],
}));

const loadRepositories = async () => {
  const { hasLoaded, isLoading } = useRepositoriesStore.getState();

  if (hasLoaded || isLoading) {
    return;
  }

  useRepositoriesStore.setState({ isLoading: true });

  try {
    const { data } = await getRepositoriesAction();

    useRepositoriesStore.setState({ repositories: data || [] });
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
  } finally {
    useRepositoriesStore.setState({ hasLoaded: true, isLoading: false });
  }
};

/** The repositories the GitHub App can see, and whether they've loaded. */
export const useRepositoriesState = (): {
  hasLoaded: boolean;
  repositories: GithubSelectedRepositoriesModel[];
} => {
  const repositories = useRepositoriesStore(state => state.repositories);
  const hasLoaded = useRepositoriesStore(state => state.hasLoaded);

  useEffect(() => {
    void loadRepositories();
  }, []);

  return { hasLoaded, repositories };
};

/** The repositories the GitHub App can see (empty until they've loaded). */
export const useRepositories = (): GithubSelectedRepositoriesModel[] =>
  useRepositoriesState().repositories;
