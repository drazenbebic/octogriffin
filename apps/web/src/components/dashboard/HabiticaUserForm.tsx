'use client';

import Link from 'next/link';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { Form, useFormStore } from '@ariakit/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { FormInput } from '@/components/ui/FormInput';
import { Heading } from '@/components/ui/Heading';
import { useHabiticaStore } from '@/store/useHabiticaStore';

export const HabiticaUserForm: FC = () => {
  const {
    fetchHabiticaConnection,
    fetchHabiticaCredentials,
    fetchHabiticaStats,
    habiticaCredentials,
    isHabiticaConnected,
    upsertHabiticaUser,
  } = useHabiticaStore();

  // The form's own state, independent of the stats card and badge
  const [isLoading, setIsLoading] = useState(true);

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
    toast.success('Habitica connection saved');
  });

  useEffect(() => {
    void (async () => {
      await fetchHabiticaCredentials();
      await fetchHabiticaConnection();
      setIsLoading(false);
    })();
  }, [fetchHabiticaCredentials, fetchHabiticaConnection]);

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

  const hasSavedToken = !!habiticaCredentials?.hasApiToken;
  const isTokenUnreadable =
    !!habiticaCredentials && !habiticaCredentials.hasApiToken;

  return (
    <Form
      className="flex flex-col rounded-lg border border-border bg-surface shadow-e1"
      resetOnSubmit={false}
      store={form}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <Heading level={2} size="h3">
            Habitica connection
          </Heading>
          <p className="text-[13px] text-text-2">
            Octogriffin scores habits with these credentials.
          </p>
        </div>
        <Chip dot shape="pill" tone={isHabiticaConnected ? 'ok' : 'neutral'}>
          {isHabiticaConnected ? 'Connected' : 'Not connected'}
        </Chip>
      </div>

      <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
        <FormInput
          description="In Habitica: Settings › Site Data."
          disabled={isLoading}
          inputClassName="font-mono text-[13px]"
          label="User ID"
          name="userId"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          required
        />

        <FormInput
          description={
            isTokenUnreadable
              ? "We couldn't read your saved API token. Please enter it again."
              : "Encrypted before it's stored. It never comes back to your browser."
          }
          disabled={isLoading}
          label="API token"
          name="apiToken"
          placeholder={
            hasSavedToken
              ? 'Saved. Leave empty to keep it.'
              : 'Paste your API token'
          }
          required={!hasSavedToken}
          revealLabel="token"
          type="password"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-lg border-t border-border bg-sunken px-6 py-4">
        <Link
          className="text-[13px] font-semibold text-accent-text"
          href="/docs/habitica-api-token"
        >
          Where do I find these?
        </Link>
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Save connection
        </Button>
      </div>
    </Form>
  );
};
