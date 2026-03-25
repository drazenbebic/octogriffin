import { Organization, Person } from 'schema-dts';

export const AUTHOR_PERSON: Person = {
  '@type': 'Person',
  name: 'Drazen Bebic',
  url: 'https://bebic.dev',
  sameAs: [
    'https://github.com/drazenbebic',
    'https://x.com/drazenbebic',
    'https://www.linkedin.com/in/drazenbebic/',
    'https://medium.com/@drazen.bebic',
    'https://dev.to/drazenbebic',
    'https://profiles.wordpress.org/drazenbebic/',
  ],
  knowsAbout: [
    'Next.js',
    'Storyblok',
    'Sanity.io',
    'React',
    'Laravel',
    'TypeScript',
  ],
};

export const OCTOGRIFFIN_ORG: Organization = {
  '@type': 'Organization',
  name: 'Octogriffin',
  url: 'https://octogriffin.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://octogriffin.com/octogriffin_logo_square.png',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Postfach 0029',
    addressLocality: 'Vienna',
    postalCode: '1190',
    addressCountry: 'AT',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'octogriffin@bebic.dev',
    contactType: 'customer support',
  },
};
