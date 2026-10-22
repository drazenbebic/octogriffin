'use server';

import { getAllRepositories } from '@/accessors/repository';
import { runUserAction } from '@/lib/userAction';

export async function getRepositoriesAction() {
  return runUserAction('getRepositoriesAction', githubUser =>
    getAllRepositories(githubUser.id),
  );
}
