'use client';

import React, { FC, useEffect, useState } from 'react';

import { Form, useFormStore } from '@ariakit/react';
import {
  AlertCircleIcon,
  FloppyDiskIcon,
  Link01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { useHabiticaStore } from '@/store/useHabiticaStore';
import { UserCredentials } from '@/types/habitica';

export const HabiticaUserForm: FC = () => {
  const {
    habiticaCredentials,
    fetchHabiticaCredentials,
    fetchHabiticaConnection,
    fetchHabiticaStats,
    upsertHabiticaUser,
    isLoading,
    setIsLoading,
  } = useHabiticaStore();

  const [values, setValues] = useState<UserCredentials>({
    userId: '',
    apiToken: '',
  });
  const form = useFormStore({ values, setValues });

  form.useSubmit(async state => {
    setIsLoading(true);

    const success = await upsertHabiticaUser({
      userId: state.values.userId,
      apiToken: state.values.apiToken,
    });

    if (!success) {
      setIsLoading(false);

      return;
    }

    await Promise.all([fetchHabiticaConnection(), fetchHabiticaStats()]);

    setIsLoading(false);
    toast.success('Configuration saved successfully');
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchHabiticaCredentials();
      await fetchHabiticaConnection();
      setIsLoading(false);
    })();
  }, [fetchHabiticaCredentials, fetchHabiticaConnection, setIsLoading]);

  useEffect(() => {
    if (!habiticaCredentials) {
      return;
    }

    setValues(habiticaCredentials);
  }, [habiticaCredentials]);

  return (
    <Form className="flex flex-col gap-6" resetOnSubmit={false} store={form}>
      <FormInput
        disabled={isLoading}
        label="User ID"
        leadingIcon={<HugeiconsIcon icon={Link01Icon} size={20} />}
        name="userId"
        placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        required
      />

      <FormInput
        disabled={isLoading}
        label="API Token"
        leadingIcon={<HugeiconsIcon icon={AlertCircleIcon} size={20} />}
        name="apiToken"
        placeholder="••••••••••••••••••••••••••••••"
        required
        type="password"
      />

      <div className="pt-2">
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          <HugeiconsIcon className="mr-2" icon={FloppyDiskIcon} size={20} />
          Save Configuration
        </Button>
      </div>
    </Form>
  );
};
