export type UserProfile = {
  name: string;
  handle: string;
  avatar: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  email: string | null;
  joinedAt: bigint;
  isLinked: boolean;
  hasInstallation: boolean;
  githubUrl: string | null;
};
