'use client';

import { FC, useState, useTransition } from 'react';

import {
  DialogProvider,
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
  Form,
  FormSubmit,
  useFormStore,
} from '@ariakit/react';
import {
  ArrowDown01Icon,
  GithubIcon,
  PencilEdit02Icon,
  Task01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Dialog } from '@/components/ui/Dialog';
import { DialogDismiss } from '@/components/ui/DialogDismiss';
import { FormCombobox } from '@/components/ui/FormCombobox';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Heading } from '@/components/ui/Heading';
import { SelectItem } from '@/components/ui/SelectItem';
import { useRepositories } from '@/hooks/useRepositories';
import { useRepositoryOptions } from '@/hooks/useRepositoryOptions';
import { TriggerSchema, triggerSchema } from '@/schemas/triggerSchema';
import { useTriggersStore } from '@/store/useTriggersStore';
import { TriggerWithRepos } from '@/types/triggers';
import { cn } from '@/utils/cn';
import { getGroupedGithubEvents } from '@/utils/githubEvents';

export type TriggerModalProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  trigger?: TriggerWithRepos;
  onSuccessAction?: () => void;
};

export const TriggerModal: FC<TriggerModalProps> = ({
  open,
  setOpenAction,
  trigger,
  onSuccessAction,
}) => {
  const isEdit = !!trigger;

  const [values, setValues] = useState<TriggerSchema>({
    event: trigger?.event || '',
    repositories: trigger?.repositories.map(({ uuid }) => uuid) || [],
    taskTitle: trigger?.taskTitle || '',
    taskNote: trigger?.taskNote || '',
    scoreDirection: trigger?.scoreDirection || 'up',
    taskPriority: trigger?.taskPriority || 1,
    taskAttribute: trigger?.taskAttribute || 'str',
    taskFrequency: trigger?.taskFrequency || 'daily',
    taskAlias: trigger?.taskAlias || '',
    taskTags: (trigger?.taskTags || '') as string,
  });

  const createTrigger = useTriggersStore(state => state.createTrigger);
  const updateTrigger = useTriggersStore(state => state.updateTrigger);
  const repositories = useRepositories();
  const githubEventOptions = getGroupedGithubEvents();
  const form = useFormStore<TriggerSchema>({ values, setValues });
  const [isPending, startTransition] = useTransition();
  const repositoryOptions = useRepositoryOptions(repositories);

  form.useSubmit(async state => {
    const validation = triggerSchema.safeParse(state.values);

    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        form.setError(issue.path[0] as string, issue.message);
      });

      return;
    }

    startTransition(async () => {
      let result;

      if (isEdit && trigger) {
        result = await updateTrigger(trigger.uuid, validation.data);
      } else {
        result = await createTrigger(validation.data);
      }

      if (result) {
        toast.success(
          isEdit
            ? 'Trigger updated successfully'
            : 'Trigger created successfully',
        );

        if (!isEdit) {
          form.reset();
        }

        setOpenAction(false);
        onSuccessAction?.();
      }
    });
  });

  const handleDialogClose = () => {
    if (!isEdit) {
      setTimeout(() => {
        form.reset();
      }, 300);
    }
  };

  return (
    <DialogProvider open={open} setOpen={setOpenAction}>
      <Dialog
        className="max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClose={handleDialogClose}
        size="lg"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <HugeiconsIcon
                icon={isEdit ? PencilEdit02Icon : ZapIcon}
                size={20}
              />
            </div>
            <Heading as="h2" size="lg">
              {isEdit ? 'Edit Trigger' : 'New Trigger'}
            </Heading>
          </div>
          <DialogDismiss
            label={`Close the ${isEdit ? 'edit' : 'add'} trigger modal`}
          />
        </div>

        <Form className="space-y-8" resetOnSubmit={false} store={form}>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fields marked with <span className="text-red-500">*</span> are
            required.
          </p>

          {/* GitHub Trigger Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <HugeiconsIcon icon={GithubIcon} size={18} />
              </div>
              <Heading
                as="h3"
                className="font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                size="sm"
              >
                1. GitHub Trigger
              </Heading>
            </div>

            <Card variant="flat">
              <CardBody className="grid gap-4 sm:grid-cols-2" padding="sm">
                <FormCombobox
                  items={githubEventOptions}
                  label="Event"
                  name="event"
                  placeholder="Select a GitHub event..."
                  required
                />

                <FormCombobox
                  items={repositoryOptions}
                  label="Repositories"
                  multiple
                  name="repositories"
                  placeholder="Select repositories..."
                />
              </CardBody>
            </Card>
          </div>

          {/* Habitica Task Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                <HugeiconsIcon icon={Task01Icon} size={18} />
              </div>
              <Heading
                as="h3"
                className="font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                size="sm"
              >
                2. Habitica Task
              </Heading>
            </div>

            <Card variant="flat">
              <CardBody className="grid gap-4 sm:grid-cols-2" padding="sm">
                <div className="sm:col-span-2">
                  <FormInput
                    description="A new task will be created if it doesn't exist."
                    label="Task Title"
                    name="taskTitle"
                    placeholder="e.g. Pushed Code"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FormTextarea
                    label="Notes"
                    maxLength={255}
                    name="taskNote"
                    placeholder="Add extra details..."
                  />
                </div>

                <FormSelect label="Difficulty" name="taskPriority">
                  <SelectItem value="0.1">Trivial</SelectItem>
                  <SelectItem value="1">Easy</SelectItem>
                  <SelectItem value="1.5">Medium</SelectItem>
                  <SelectItem value="2">Hard</SelectItem>
                </FormSelect>

                <FormSelect label="Attribute" name="taskAttribute">
                  <SelectItem value="str">STR</SelectItem>
                  <SelectItem value="int">INT</SelectItem>
                  <SelectItem value="con">CON</SelectItem>
                  <SelectItem value="per">PER</SelectItem>
                </FormSelect>

                <FormSelect label="Action" name="scoreDirection">
                  <SelectItem value="up">Reward (XP/Gold)</SelectItem>
                  <SelectItem value="down">Punish (Lose Health)</SelectItem>
                </FormSelect>

                <FormSelect label="Reset Counter" name="taskFrequency">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </FormSelect>
              </CardBody>
            </Card>
          </div>

          <DisclosureProvider>
            <Card variant="flat">
              <Disclosure
                className={cn(
                  'cursor-pointer group flex w-full items-center justify-between px-5 py-3.5 font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2',
                )}
              >
                <span className="text-xs">Advanced Settings</span>
                <HugeiconsIcon
                  className="text-slate-400 transition-transform group-aria-expanded:rotate-180 dark:text-slate-500"
                  icon={ArrowDown01Icon}
                  size={16}
                />
              </Disclosure>

              <DisclosureContent className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
                <FormInput
                  description="Unique identifier for API operations."
                  label="Task Alias"
                  name="taskAlias"
                  placeholder="e.g. my-habit-alias"
                />
              </DisclosureContent>
            </Card>
          </DisclosureProvider>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => setOpenAction(false)}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <FormSubmit
              render={
                <Button disabled={isPending} isLoading={isPending}>
                  {isPending
                    ? isEdit
                      ? 'Saving...'
                      : 'Creating...'
                    : isEdit
                      ? 'Save Changes'
                      : 'Create Trigger'}
                </Button>
              }
            />
          </div>
        </Form>
      </Dialog>
    </DialogProvider>
  );
};
