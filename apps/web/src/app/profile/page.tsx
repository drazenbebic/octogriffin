import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

import { getUserProfileAction } from '@/actions/getUserProfileAction';
import { AuthGate } from '@/components/AuthGate';
import { ContactDetailsCard } from '@/components/profile/ContactDetailsCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Content } from '@/components/ui/Content';
import { Heading } from '@/components/ui/Heading';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'View your adventurer identity, manage account details, and check your Habitica connection status.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthGate />;
  }

  const profile = await getUserProfileAction();

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <Heading
          className="mb-2 bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400"
          level={1}
          size="3xl"
        >
          Adventurer Profile
        </Heading>
        <Content size="lg">
          Your personal identity card and connection status.
        </Content>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card
            className="overflow-hidden border-0 shadow-xl shadow-violet-900/5 ring-1 ring-slate-900/5 dark:ring-slate-800"
            variant="elevated"
          >
            <div className="h-32 w-full bg-linear-to-br from-violet-600 via-indigo-600 to-blue-600 relative" />

            <div className="relative -mt-16 px-6 pb-8 text-center">
              <div className="mx-auto inline-flex rounded-full bg-white p-2 shadow-lg dark:bg-slate-900">
                <Image
                  alt={`${profile.handle || 'Adventurer'} avatar`}
                  className="rounded-full bg-slate-100 object-cover"
                  height={112}
                  priority
                  src={profile.avatar || '/placeholder-avatar.png'}
                  width={112}
                />
              </div>

              <div className="mt-4">
                <Heading className="tracking-tight" level={2} size="xl">
                  {profile.name}
                </Heading>
                <Content className="font-medium" color="violet">
                  @{profile.handle}
                </Content>
              </div>

              <div className="mt-6 flex justify-center">
                <Badge
                  className="shadow-sm"
                  hasDot
                  size="md"
                  variant={profile.isLinked ? 'success' : 'warning'}
                >
                  {profile.isLinked ? 'Sync Active' : 'No Sync Configured'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <ContactDetailsCard profile={profile} />
        </div>
      </div>
    </div>
  );
}
