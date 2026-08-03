export type UserProfile = {
  name: string;
  handle: string;
  avatar: null | string;
  location: null | string;
  company: null | string;
  website: null | string;
  email: null | string;
  joinedAt: bigint;
  isLinked: boolean;
  hasInstallation: boolean;
  githubUrl: null | string;
};
