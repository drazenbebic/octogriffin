'use client';

import { FC, useEffect, useState, useTransition } from 'react';

import {
  DialogProvider,
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
  Form,
  FormSubmit,
  useFormStore,
} from '@ariakit/react';
import clsx from 'clsx';
import { ArrowDown01Icon, PencilEdit02Icon } from 'hugeicons-react';
import { toast } from 'sonner';

import { getRepositoriesAction } from '@/actions/repositories/getRepositoriesAction';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DialogDismiss } from '@/components/ui/DialogDismiss';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Heading } from '@/components/ui/Heading';
import { SelectItem } from '@/components/ui/SelectItem';
import { GithubSelectedRepositoriesModel } from '@/generated/prisma/models/GithubSelectedRepositories';
import { useGithubEventsOptions } from '@/hooks/useGithubEventsOptions';
import { TriggerSchema, triggerSchema } from '@/schemas/triggerSchema';
import { useTriggersStore } from '@/store/useTriggersStore';
import { TriggerWithRepos } from '@/types/triggers';

export type EditWebhookTriggerModalProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  trigger: TriggerWithRepos;
  onSuccessAction?: () => void;
};

export const EditTriggerModal: FC<EditWebhookTriggerModalProps> = ({
  open,
  setOpenAction,
  trigger,
  onSuccessAction,
}) => {
  const githubEventOptions = useGithubEventsOptions();
  const updateTrigger = useTriggersStore(state => state.updateTrigger);
  const [repositories, setRepositories] = useState<
    GithubSelectedRepositoriesModel[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<TriggerSchema>({
    event: trigger.event,
    repositories: trigger.repositories.map(({ uuid }) => uuid),
    taskTitle: trigger.taskTitle,
    taskNote: trigger.taskNote || '',
    scoreDirection: trigger.scoreDirection,
    taskPriority: trigger.taskPriority,
    taskAttribute: trigger.taskAttribute,
    taskFrequency: trigger.taskFrequency,
    taskAlias: trigger.taskAlias || '',
    taskTags: (trigger.taskTags || '') as string,
  });

  useEffect(() => {
    startTransition(async () => {
      const { data: newRepositories } = await getRepositoriesAction();
      setRepositories(newRepositories || []);
    });
  }, []);

  const form = useFormStore<TriggerSchema>({
    values,
    setValues,
  });

  form.useSubmit(async state => {
    const validation = triggerSchema.safeParse(state.values);

    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        form.setError(issue.path[0] as string, issue.message);
      });
      return;
    }

    startTransition(async () => {
      const updatedTrigger = await updateTrigger(trigger.uuid, validation.data);

      if (updatedTrigger) {
        toast.success('Trigger updated successfully');
        setOpenAction(false);
        onSuccessAction?.();
      }
    });
  });

  return (
    <DialogProvider open={open} setOpen={setOpenAction}>
      <Dialog className="sm:max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <PencilEdit02Icon size={20} />
            </div>
            <Heading as="h2" size="lg">
              Edit Trigger
            </Heading>
          </div>
          <DialogDismiss label="Close the edit webhook trigger modal" />
        </div>

        <Form store={form} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              name="event"
              label="When this happens on GitHub..."
              required
            >
              {githubEventOptions}
            </FormSelect>

            <FormSelect
              name="repositories"
              label="...on one of these repositories..."
              placeholder="Please select at least one repository"
              required
              multiple
            >
              {repositories.map(repository => (
                <SelectItem key={repository.uuid} value={repository.uuid}>
                  {repository.fullName}
                </SelectItem>
              ))}
            </FormSelect>
          </div>

          <div className="border-t border-slate-100" />

          {/* Habitica Task */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormInput
                  name="taskTitle"
                  label="...score this task in Habitica"
                  placeholder="Task Title (e.g. Pushed Code)"
                  description="If a task with this title doesn't exist, we will automatically create it for you."
                />
              </div>

              <div className="sm:col-span-2">
                <FormTextarea
                  name="taskNote"
                  label="Notes"
                  placeholder="Add extra details... (optional)"
                  maxLength={255}
                />
              </div>

              {/* Difficulty */}
              <FormSelect name="taskPriority" label="Difficulty">
                <SelectItem value="0.1">Trivial</SelectItem>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="1.5">Medium</SelectItem>
                <SelectItem value="2">Hard</SelectItem>
              </FormSelect>

              {/* Attribute */}
              <FormSelect name="taskAttribute" label="Attribute">
                <SelectItem value="str">STR</SelectItem>
                <SelectItem value="int">INT</SelectItem>
                <SelectItem value="con">CON</SelectItem>
                <SelectItem value="per">PER</SelectItem>
              </FormSelect>

              {/* Direction */}
              <FormSelect name="scoreDirection" label="Action">
                <SelectItem value="up">Reward (XP/Gold)</SelectItem>
                <SelectItem value="down">Punish (Lose Health)</SelectItem>
              </FormSelect>

              {/* Frequency */}
              <FormSelect name="taskFrequency" label="Reset Counter">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </FormSelect>
            </div>
          </div>

          <DisclosureProvider>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50">
              <Disclosure
                className={clsx(
                  'cursor-pointer group flex w-full items-center justify-between px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2',
                )}
              >
                <span>Advanced Settings</span>
                <ArrowDown01Icon
                  size={16}
                  className="text-slate-400 transition-transform group-aria-expanded:rotate-180"
                />
              </Disclosure>

              <DisclosureContent className="border-t border-slate-100 px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    name="taskAlias"
                    label="Task Alias"
                    placeholder="e.g. my-habit-alias"
                    description="Unique identifier for API operations."
                  />

                  <FormInput
                    name="taskTags"
                    label="Tags"
                    placeholder="comma, separated, tags"
                    description="Coming soon..."
                    disabled
                  />
                </div>
              </DisclosureContent>
            </div>
          </DisclosureProvider>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setOpenAction(false)}
              type="button"
            >
              Cancel
            </Button>
            <FormSubmit
              render={
                <Button disabled={isPending} isLoading={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              }
            />
          </div>
        </Form>
      </Dialog>
    </DialogProvider>
  );
};
