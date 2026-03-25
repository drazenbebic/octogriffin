import { FC } from 'react';

import { Thing, WithContext } from 'schema-dts';

export type StructuredDataProps<T extends Thing> = {
  data?: WithContext<T>;
};

export const JsonLd: FC<
  StructuredDataProps<
    Thing & {
      '@context': 'https://schema.org';
    }
  >
> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
