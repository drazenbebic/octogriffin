/**
 * Keeps only the path, query and hash of a URL, so redirecting to it never
 * leaves this site.
 */
export const sameSitePath = (url: string) => {
  try {
    const { hash, pathname, search } = new URL(url, 'http://localhost');

    // Browsers read a path starting with "//" as another host
    return `${pathname.replace(/^\/+/, '/')}${search}${hash}`;
  } catch {
    return '/';
  }
};
