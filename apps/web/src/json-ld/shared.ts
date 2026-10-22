import type { Organization, Person } from 'schema-dts';

import { absoluteUrl, pageUrl } from '@/seo/pageCatalog';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { githubRepositoryUrl } from '@/utils/githubRepositoryUrl';

export const AUTHOR_PERSON: Person = {
  '@type': 'Person',
  knowsAbout: [
    'Next.js',
    'Storyblok',
    'Sanity.io',
    'React',
    'Laravel',
    'TypeScript',
  ],
  name: 'Drazen Bebic',
  sameAs: [
    'https://github.com/drazenbebic',
    'https://x.com/drazenbebic',
    'https://www.linkedin.com/in/drazenbebic/',
    'https://medium.com/@drazen.bebic',
    'https://dev.to/drazenbebic',
    'https://profiles.wordpress.org/drazenbebic/',
  ],
  url: 'https://bebic.dev',
};

// Other pages that represent Octogriffin itself.
export const OCTOGRIFFIN_SAME_AS = [
  githubRepositoryUrl(),
  githubAppUrl(),
].filter(Boolean);

export const OCTOGRIFFIN_ORG: Organization = {
  '@type': 'Organization',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'AT',
    addressLocality: 'Vienna',
    postalCode: '1190',
    streetAddress: 'Postfach 0029',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'octogriffin@bebic.dev',
  },
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/octogriffin_logo_square.png'),
  },
  name: 'Octogriffin',
  sameAs: OCTOGRIFFIN_SAME_AS,
  url: pageUrl('/'),
};
