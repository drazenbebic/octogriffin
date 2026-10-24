import type { Recipe } from '@/config/recipes';
import { recipes } from '@/config/recipes';
import type { TriggerSchema } from '@/schemas/triggerSchema';

/** The recipe for a slug from the URL, or nothing for unknown slugs. */
export const getRecipe = (
  slug: null | string | undefined,
): Recipe | undefined =>
  slug ? recipes.find(recipe => recipe.slug === slug) : undefined;

/** Whether the user already has a trigger made from this recipe. */
export const isRecipeInDashboard = (
  recipe: Recipe,
  triggers: { event: string; taskTitle: string }[],
): boolean =>
  triggers.some(
    ({ event, taskTitle }) =>
      event === recipe.preset.event && taskTitle === recipe.preset.taskTitle,
  );

/**
 * The trigger form's values for a recipe. With exactly one connected
 * repository it's pre-selected, so adding the recipe is a single click.
 */
export const recipeToTriggerValues = (
  recipe: Recipe,
  repositoryUuids: string[],
): TriggerSchema => ({
  event: recipe.preset.event,
  repositories: repositoryUuids.length === 1 ? [...repositoryUuids] : [],
  scoreDirection: recipe.preset.scoreDirection,
  taskAlias: '',
  taskAttribute: recipe.preset.taskAttribute,
  taskFrequency: recipe.preset.taskFrequency,
  taskNote: recipe.preset.taskNote ?? '',
  taskPriority: recipe.preset.taskPriority,
  taskTags: '',
  taskTitle: recipe.preset.taskTitle,
});
