import type { Metadata } from 'next';

import { HabiticaUserForm } from '@/components/dashboard/HabiticaUserForm';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    description:
      'Manage your account configuration. Securely update your Habitica User ID and API Token to ensure seamless synchronization between GitHub and your character.',
    path: 'dashboard/settings',
    suffix: 'Octogriffin Dashboard',
    title: 'Settings',
  });
};

export default function DashboardSettingsPage() {
  return <HabiticaUserForm />;
}
