export const githubRepositoryUrl = (path?: string) => {
  const baseUrl = 'https://github.com/drazenbebic/octogriffin';

  if (!path) {
    return baseUrl;
  }

  return `${baseUrl}${path}`;
};
