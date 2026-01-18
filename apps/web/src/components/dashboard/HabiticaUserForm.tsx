'use client';

import React, { FC, useEffect, useState } from 'react';

import { Form, useFormStore } from '@ariakit/react';
import { AlertCircleIcon, FloppyDiskIcon, Link01Icon } from 'hugeicons-react';
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
    <Form resetOnSubmit={false} store={form} className="flex flex-col gap-6">
      <FormInput
        name="userId"
        label="User ID"
        disabled={isLoading}
        placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        leadingIcon={<Link01Icon size={20} />}
        required
      />

      <FormInput
        name="apiToken"
        label="API Token"
        type="password"
        disabled={isLoading}
        placeholder="••••••••••••••••••••••••••••••"
        leadingIcon={<AlertCircleIcon size={20} />}
        required
      />

      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          <FloppyDiskIcon size={20} className="mr-2" />
          Save Configuration
        </Button>
      </div>
    </Form>
  );
};
