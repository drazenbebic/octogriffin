import { FC } from 'react';

import { Thing, WithContext } from 'schema-dts';

export type StructuredDataProps<T extends Thing> = {
  data?: WithContext<T>;
};

export const JsonLd: FC<
  StructuredDataProps<
    {
      '@context': 'https://schema.org';
    } & Thing
  >
> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
};
