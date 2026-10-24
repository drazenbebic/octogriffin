'use client';

import type { FC } from 'react';
import { Suspense, useCallback, useEffect, useState } from 'react';

import { DeleteTriggerModal } from '@/components/dashboard/DeleteTriggerModal';
import { TriggerModal } from '@/components/dashboard/TriggerModal';
import { TriggersList } from '@/components/dashboard/TriggersList';
import type { Recipe } from '@/config/recipes';
import type { TriggersModel } from '@/generated/prisma/models/Triggers';
import { useRecipeParam } from '@/hooks/useRecipeParam';
import type { TriggerWithRepos } from '@/types/triggers';

/** Opens the trigger dialog for `/dashboard?recipe=…`, then tidies the URL. */
const RecipeParamOpener: FC<{ onRecipe: (recipe: Recipe) => void }> = ({
  onRecipe,
}) => {
  const { clear, recipe } = useRecipeParam();

  useEffect(() => {
    if (recipe) {
      onRecipe(recipe);
      clear();
    }
  }, [recipe, onRecipe, clear]);

  return null;
};

export default function DashboardPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<null | TriggerWithRepos>(
    null,
  );
  const [deletingTrigger, setDeletingTrigger] = useState<null | TriggersModel>(
    null,
  );
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);

  const handleOpenCreate = () => {
    setRecipe(undefined);
    setEditingTrigger(null);
    setModalOpen(true);
  };

  const handleOpenRecipe = useCallback((picked: Recipe) => {
    setEditingTrigger(null);
    setRecipe(picked);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = (trigger: TriggersModel) => {
    setRecipe(undefined);
    setEditingTrigger(trigger as TriggerWithRepos);
    setModalOpen(true);
  };

  return (
    <>
      <Suspense fallback={null}>
        <RecipeParamOpener onRecipe={handleOpenRecipe} />
      </Suspense>

      <TriggersList
        onOpenCreateAction={handleOpenCreate}
        onOpenDeleteAction={trigger => setDeletingTrigger(trigger)}
        onOpenEditAction={handleOpenEdit}
      />

      <TriggerModal
        key={
          editingTrigger
            ? `edit-${editingTrigger.uuid}`
            : recipe
              ? `recipe-${recipe.slug}`
              : 'create'
        }
        onSuccessAction={() => {
          setModalOpen(false);
          setEditingTrigger(null);
          setRecipe(undefined);
        }}
        open={isModalOpen}
        recipe={recipe}
        setOpenAction={setModalOpen}
        trigger={editingTrigger || undefined}
      />

      {deletingTrigger && (
        <DeleteTriggerModal
          key={`delete-${deletingTrigger.uuid}`}
          onSuccessAction={() => {
            setEditingTrigger(null);
          }}
          open={!!deletingTrigger}
          setOpenAction={open => {
            if (!open) {
              setDeletingTrigger(null);
            }
          }}
          trigger={deletingTrigger}
        />
      )}
    </>
  );
}
