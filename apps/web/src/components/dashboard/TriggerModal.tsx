'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { useRef, useState, useTransition } from 'react';

import {
  DialogProvider,
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
  Form,
  FormSubmit,
  useFormStore,
  useStoreState,
} from '@ariakit/react';
import {
  ArrowDown01Icon,
  ArrowDownRight01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  PencilEdit02Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { HabitPreview } from '@/components/dashboard/HabitPreview';
import { TriggerSentence } from '@/components/TriggerSentence';
import { attributeOrder, attributes } from '@/components/ui/AttributeChip';
import { Button } from '@/components/ui/Button';
import { ChoiceCard, ChoiceCardGroup } from '@/components/ui/ChoiceCard';
import { Dialog } from '@/components/ui/Dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/DialogParts';
import { FormCombobox } from '@/components/ui/FormCombobox';
import { FormInput } from '@/components/ui/FormInput';
import { FormSegmentedControl } from '@/components/ui/FormSegmentedControl';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Menu, MenuItem } from '@/components/ui/Menu';
import type { Recipe } from '@/config/recipes';
import { recipes } from '@/config/recipes';
import { useRepositories } from '@/hooks/useRepositories';
import { useRepositoryOptions } from '@/hooks/useRepositoryOptions';
import type { TriggerSchema } from '@/schemas/triggerSchema';
import { triggerSchema } from '@/schemas/triggerSchema';
import { useTriggersStore } from '@/store/useTriggersStore';
import type { TriggerWithRepos } from '@/types/triggers';
import { cn } from '@/utils/cn';
import { describeTrigger } from '@/utils/describeTrigger';
import { githubAppUrl } from '@/utils/githubAppUrl';
import { getGroupedGithubEvents } from '@/utils/githubEvents';
import { recipeToTriggerValues } from '@/utils/recipes';

export type TriggerModalProps = {
  onSuccessAction?: () => void;
  open: boolean;
  /** Opens the dialog pre-filled from a recipe. */
  recipe?: Recipe;
  setOpenAction: (open: boolean) => void;
  trigger?: TriggerWithRepos;
};

const defaultValues: TriggerSchema = {
  event: '',
  repositories: [],
  scoreDirection: 'up',
  taskAlias: '',
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskNote: '',
  taskPriority: 1,
  taskTags: '',
  taskTitle: '',
};

const difficultyOptions = [
  { label: 'Trivial', value: '0.1' },
  {
    label: (
      <>
        Easy <span className="text-xp">★</span>
      </>
    ),
    name: 'Easy',
    value: '1',
  },
  {
    label: (
      <>
        Medium <span className="text-xp">★★</span>
      </>
    ),
    name: 'Medium',
    value: '1.5',
  },
  {
    label: (
      <>
        Hard <span className="text-xp">★★★</span>
      </>
    ),
    name: 'Hard',
    value: '2',
  },
];

const attributeOptions = attributeOrder.map(value => ({
  label: <span className="font-mono">{value.toUpperCase()}</span>,
  name: attributes[value].title,
  tooltip: {
    description: attributes[value].description,
    title: attributes[value].title,
  },
  value,
}));

const frequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const Legend: FC<{ children: string }> = ({ children }) => (
  <legend className="mb-3.5 p-0 font-display text-[17px] font-bold tracking-[-0.02em] text-text">
    {children}
  </legend>
);

const triggerToValues = (trigger: TriggerWithRepos): TriggerSchema => ({
  event: trigger.event,
  repositories: trigger.repositories.map(({ uuid }) => uuid),
  scoreDirection: trigger.scoreDirection as TriggerSchema['scoreDirection'],
  taskAlias: trigger.taskAlias || '',
  taskAttribute: trigger.taskAttribute as TriggerSchema['taskAttribute'],
  taskFrequency: trigger.taskFrequency as TriggerSchema['taskFrequency'],
  taskNote: trigger.taskNote || '',
  taskPriority: trigger.taskPriority,
  taskTags: (trigger.taskTags || '') as string,
  taskTitle: trigger.taskTitle,
});

export const TriggerModal: FC<TriggerModalProps> = ({
  onSuccessAction,
  open,
  recipe,
  setOpenAction,
  trigger,
}) => {
  const isEdit = !!trigger;
  const repositories = useRepositories();
  const repositoryOptions = useRepositoryOptions(repositories);
  const githubEventOptions = getGroupedGithubEvents();
  const createTrigger = useTriggersStore(state => state.createTrigger);
  const updateTrigger = useTriggersStore(state => state.updateTrigger);
  const [isPending, startTransition] = useTransition();
  // The pickers keep their own selection, so they're remounted on reset
  const [resetCount, setResetCount] = useState(0);
  const repositoriesRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<TriggerSchema>(() => {
    if (trigger) {
      return triggerToValues(trigger);
    }

    return recipe
      ? recipeToTriggerValues(
          recipe,
          repositories.map(({ uuid }) => uuid),
        )
      : defaultValues;
  });
  const form = useFormStore<TriggerSchema>({ setValues, values });
  const formValues = useStoreState(form, state => state.values);

  // Repositories arrive after the dialog opens; pre-select the only one
  const [hasPreselected, setHasPreselected] = useState(false);

  if (
    recipe &&
    !hasPreselected &&
    repositories.length === 1 &&
    values.repositories.length === 0
  ) {
    setHasPreselected(true);
    setValues(current => ({
      ...current,
      repositories: [repositories[0].uuid],
    }));
    setResetCount(count => count + 1);
  }

  const applyRecipe = (picked: Recipe) => {
    form.setValues({
      ...form.getState().values,
      ...recipeToTriggerValues(
        picked,
        repositories.map(({ uuid }) => uuid),
      ),
      repositories: form.getValue('repositories'),
    });
    setResetCount(count => count + 1);
  };

  const resetForm = () => {
    form.reset();
    setResetCount(count => count + 1);
  };

  const selectedRepoNames = repositories
    .filter(({ uuid }) => formValues.repositories?.includes(uuid))
    .map(({ name }) => name);

  const sentence = describeTrigger(
    { ...formValues, taskPriority: Number(formValues.taskPriority) },
    { repoNames: selectedRepoNames, totalRepos: repositories.length },
  );

  const hasNoRepositories = repositories.length === 0;

  form.useSubmit(state => {
    const validation = triggerSchema.safeParse(state.values);

    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        form.setError(issue.path[0] as string, issue.message);
      });

      return;
    }

    startTransition(async () => {
      const result =
        isEdit && trigger
          ? await updateTrigger(trigger.uuid, validation.data)
          : await createTrigger(validation.data);

      if (!result) {
        return;
      }

      if (recipe) {
        toast.success('Trigger added', {
          description: `${recipe.successHint} in ${selectedRepoNames[0] ?? 'your repository'} to score it.`,
        });
      } else {
        toast.success(isEdit ? 'Trigger updated' : 'Trigger created');
      }

      if (!isEdit) {
        resetForm();
      }

      setOpenAction(false);
      onSuccessAction?.();
    });
  });

  const title = isEdit
    ? 'Edit trigger'
    : recipe
      ? `Add “${recipe.title}”`
      : 'New trigger';

  const submitLabel = isEdit
    ? { idle: 'Save changes', pending: 'Saving…' }
    : recipe
      ? { idle: 'Add trigger', pending: 'Adding…' }
      : { idle: 'Create trigger', pending: 'Creating…' };

  const habitFields = (
    <>
      <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
        <Legend>Score this habit in Habitica</Legend>
        <FormInput
          description="If you already have a habit with this exact title, Octogriffin uses it."
          label="Task title"
          name="taskTitle"
          placeholder="e.g. Opened a pull request"
          required
        />
        <FormTextarea
          label="Notes"
          maxLength={255}
          name="taskNote"
          placeholder="Add extra details"
          rows={2}
        />
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-[18px] border-0 p-0">
        <Legend>How it counts</Legend>
        <ChoiceCardGroup label="Effect" name="scoreDirection">
          <ChoiceCard
            description="Earn XP and Gold"
            icon={ArrowUpRight01Icon}
            title="Reward"
            tone="ok"
            value="up"
          />
          <ChoiceCard
            description="Lose health"
            icon={ArrowDownRight01Icon}
            title="Punish"
            tone="hp"
            value="down"
          />
        </ChoiceCardGroup>
        <FormSegmentedControl
          label="Difficulty"
          name="taskPriority"
          options={difficultyOptions}
        />
        <div className="grid gap-3.5 sm:grid-cols-2">
          <FormSegmentedControl
            label="Attribute"
            name="taskAttribute"
            options={attributeOptions}
          />
          <FormSegmentedControl
            label="Counter resets"
            name="taskFrequency"
            options={frequencyOptions}
          />
        </div>
      </fieldset>

      <DisclosureProvider>
        <Disclosure className="group flex w-fit cursor-pointer items-center gap-2 rounded-sm p-0 text-[13px] font-semibold text-text-2 hover:text-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
          <HugeiconsIcon
            className="transition-transform group-aria-expanded:rotate-90"
            icon={ArrowRight01Icon}
            size={16}
          />
          Advanced: task alias
        </Disclosure>
        <DisclosureContent className="pt-3">
          <FormInput
            description="A unique ID for this habit in Habitica, for a perfect match."
            inputClassName="font-mono text-[13px]"
            label="Task alias"
            name="taskAlias"
            placeholder="my-habit-alias"
          />
        </DisclosureContent>
      </DisclosureProvider>
    </>
  );

  return (
    <DialogProvider open={open} setOpen={setOpenAction}>
      <Dialog
        className="max-h-[calc(100vh-2rem)] overflow-y-auto"
        // A recipe only needs repositories picked, so start there
        initialFocus={
          recipe && repositories.length > 1 ? repositoriesRef : undefined
        }
        onClose={() => {
          if (!isEdit) {
            setTimeout(resetForm, 300);
          }
        }}
        size="xl"
      >
        <DialogHeader
          actions={
            !isEdit && !recipe ? (
              <Menu
                label="Start from a recipe"
                trigger={
                  <Button size="sm" type="button" variant="secondary">
                    <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                    <span className="hidden sm:inline">
                      Start from a recipe
                    </span>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                  </Button>
                }
              >
                {recipes.map(item => (
                  <MenuItem
                    icon={item.icon}
                    key={item.slug}
                    onClick={() => applyRecipe(item)}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
            ) : undefined
          }
          icon={isEdit ? PencilEdit02Icon : ZapIcon}
          onCloseLabel="Close"
          title={title}
        />

        <div
          aria-live="polite"
          className="-mx-6 border-b border-border bg-sunken px-6 py-4"
        >
          <TriggerSentence parts={sentence} />
        </div>

        <Form resetOnSubmit={false} store={form}>
          <div className="-mx-6 grid md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex flex-col gap-7 p-6 md:border-r md:border-border">
              <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
                <Legend>When this happens on GitHub</Legend>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <FormCombobox
                      items={githubEventOptions}
                      key={`event-${resetCount}`}
                      label="Event"
                      name="event"
                      placeholder="Search events"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <FormCombobox
                      items={repositoryOptions}
                      key={`repositories-${resetCount}`}
                      label="Repositories"
                      multiple
                      name="repositories"
                      placeholder="Search repositories"
                      ref={repositoriesRef}
                      required
                    />
                    {hasNoRepositories && (
                      <Link
                        className="text-xs font-semibold text-accent-text"
                        href={githubAppUrl()}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Install the GitHub App on a repository first
                      </Link>
                    )}
                  </div>
                </div>
              </fieldset>

              {recipe ? (
                <DisclosureProvider>
                  <Disclosure className="group flex w-fit cursor-pointer items-center gap-2 rounded-sm p-0 text-[13px] font-semibold text-accent-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
                    <HugeiconsIcon
                      className="transition-transform group-aria-expanded:rotate-90"
                      icon={ArrowRight01Icon}
                      size={16}
                    />
                    Change title, difficulty or attribute
                  </Disclosure>
                  <DisclosureContent className="flex flex-col gap-7">
                    {habitFields}
                  </DisclosureContent>
                </DisclosureProvider>
              ) : (
                habitFields
              )}
            </div>

            <aside
              aria-label="Preview"
              className={cn(
                'flex flex-col gap-3.5 border-t border-border bg-sunken/60 px-5 py-6 md:border-t-0',
              )}
            >
              <span className="text-xs font-semibold text-muted">
                How it looks in Habitica
              </span>
              <HabitPreview
                direction={formValues.scoreDirection}
                priority={Number(formValues.taskPriority)}
                title={formValues.taskTitle}
              />
            </aside>
          </div>

          <DialogFooter
            start={
              <>
                <span className="text-hp">*</span> Required
              </>
            }
          >
            <Button
              onClick={() => setOpenAction(false)}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <FormSubmit
              render={
                <Button
                  disabled={isPending || hasNoRepositories}
                  isLoading={isPending}
                >
                  {isPending ? submitLabel.pending : submitLabel.idle}
                </Button>
              }
            />
          </DialogFooter>
        </Form>
      </Dialog>
    </DialogProvider>
  );
};
