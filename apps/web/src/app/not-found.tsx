import { Metadata } from 'next';
import Link from 'next/link';

import { Home01Icon, Search01Icon } from 'hugeicons-react';

import { Button } from '@/components/ui/Button';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';

export const metadata: Metadata = {
  title: '404 Not Found',
  description: "The page you're looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
        <div className="absolute inset-0 rounded-3xl bg-violet-600/10 blur-xl" />
        <Search01Icon size={48} />
      </div>

      <Heading level={1} size="3xl" className="mb-4">
        Quest Not Found
      </Heading>

      <Content size="lg" className="mb-8 max-w-md">
        It seems you have wandered into the void. The scroll you are looking for
        does not exist, or it has been stolen by a Rogue.
      </Content>

      <Link href="/">
        <Button size="lg">
          <Home01Icon size={20} className="mr-2" />
          Return to Tavern
        </Button>
      </Link>
    </div>
  );
}
