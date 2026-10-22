'use client';

import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

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

export const HabiticaUserForm: FC = () => {
  const {
    fetchHabiticaConnection,
    fetchHabiticaCredentials,
    fetchHabiticaStats,
    habiticaCredentials,
    isLoading,
    setIsLoading,
    upsertHabiticaUser,
  } = useHabiticaStore();

  const [values, setValues] = useState({
    apiToken: '',
    userId: '',
  });
  const form = useFormStore({ setValues, values });

  form.useSubmit(async state => {
    setIsLoading(true);

    const success = await upsertHabiticaUser({
      apiToken: state.values.apiToken,
      userId: state.values.userId,
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

  const [previousCredentials, setPreviousCredentials] =
    useState(habiticaCredentials);

  // Fill in the saved account once it loads. The saved API token never
  // reaches the browser.
  if (habiticaCredentials !== previousCredentials) {
    setPreviousCredentials(habiticaCredentials);

    if (habiticaCredentials) {
      setValues({ apiToken: '', userId: habiticaCredentials.userId });
    }
  }

  const hasSavedToken = !!habiticaCredentials;

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
        placeholder={
          hasSavedToken
            ? 'Saved. Leave empty to keep your current token.'
            : '••••••••••••••••••••••••••••••'
        }
        required={!hasSavedToken}
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
