'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';

import { Add01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { TriggerSentence } from '@/components/TriggerSentence';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DifficultyLabel } from '@/components/ui/DifficultyLabel';
import type { Recipe } from '@/config/recipes';
import { useTriggersStore } from '@/store/useTriggersStore';
import { cn } from '@/utils/cn';
import { describeTrigger } from '@/utils/describeTrigger';
import { isRecipeInDashboard } from '@/utils/recipes';

export type RecipeCardProps = {
  className?: string;
  layout?: 'card' | 'row';
  recipe: Recipe;
};

export const recipeHref = (recipe: Recipe) =>
  `/dashboard?recipe=${recipe.slug}`;

const RecipeAction: FC<{ recipe: Recipe; size: 'md' | 'sm' }> = ({
  recipe,
  size,
}) => {
  const { status } = useSession();
  const triggers = useTriggersStore(state => state.triggers);
  const fetchTriggers = useTriggersStore(state => state.fetchTriggers);
  const isAuthenticated = status === 'authenticated';

  // Load the user's triggers once, however many cards are on the page.
  // Live store state, so cards mounting together don't each fetch.
  useEffect(() => {
    const { hasLoaded, isLoading } = useTriggersStore.getState();

    if (isAuthenticated && !hasLoaded && !isLoading) {
      fetchTriggers();
    }
  }, [isAuthenticated, fetchTriggers]);

  if (isAuthenticated && isRecipeInDashboard(recipe, triggers)) {
    return (
      <Chip className="h-8 px-2.5" tone="ok">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        In your dashboard
      </Chip>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Button
        onClick={() => signIn('github', { callbackUrl: recipeHref(recipe) })}
        size={size}
        variant="secondary"
      >
        Sign in to add
      </Button>
    );
  }

  return (
    <Button
      disabled={status === 'loading'}
      render={<Link href={recipeHref(recipe)} />}
      size={size}
    >
      <HugeiconsIcon icon={Add01Icon} size={16} />
      Add to dashboard
    </Button>
  );
};

export const RecipeCard: FC<RecipeCardProps> = ({
  className,
  layout = 'card',
  recipe,
}) => {
  if (layout === 'row') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 text-left',
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
            <HugeiconsIcon icon={recipe.icon} size={18} />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-text">
              {recipe.title}
            </span>
            <code className="truncate font-mono text-xs text-muted">
              {recipe.preset.event}
            </code>
          </div>
        </div>
        <RecipeAction recipe={recipe} size="sm" />
      </div>
    );
  }

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-e1',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent-text">
          <HugeiconsIcon icon={recipe.icon} size={22} />
        </span>
        <Chip className="border border-border bg-transparent">
          <DifficultyLabel priority={recipe.preset.taskPriority} />
        </Chip>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-text">
          {recipe.title}
        </h3>
        <p className="text-sm text-text-2">{recipe.summary}</p>
      </div>
      <TriggerSentence
        className="rounded-md border border-line bg-sunken px-4 py-3"
        parts={describeTrigger(recipe.preset, {
          omitRepositories: true,
          repoNames: [],
          totalRepos: 0,
        })}
        size="sm"
      />
      <div className="mt-auto flex flex-wrap items-center gap-2.5">
        <RecipeAction recipe={recipe} size="md" />
      </div>
    </article>
  );
};
