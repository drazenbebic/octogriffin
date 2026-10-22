import type { Metadata } from 'next';

import { HabiticaUserForm } from '@/components/dashboard/HabiticaUserForm';

export const metadata: Metadata = {
  description:
    'Manage your account configuration. Securely update your Habitica User ID and API Token to ensure seamless synchronization between GitHub and your character.',
  title: 'Settings',
};

export default function DashboardSettingsPage() {
  return <HabiticaUserForm />;
}
