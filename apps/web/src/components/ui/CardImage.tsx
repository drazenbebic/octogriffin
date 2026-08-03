import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

import { cn } from '@/utils/cn';

export type CardImageProps = ImageProps;

export const CardImage: FC<CardImageProps> = ({ className, ...props }) => {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      className={cn('h-48 w-full object-cover sm:h-64', className)}
      {...props}
    />
  );
};
