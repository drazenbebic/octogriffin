import { recipes } from '@/config/recipes';

import {
  getRecipe,
  isRecipeInDashboard,
  recipeToTriggerValues,
} from './recipes';

const shipPullRequests = recipes[1];

describe('getRecipe', () => {
  it('finds a recipe by slug', () => {
    expect(getRecipe('ship-pull-requests')).toBe(shipPullRequests);
  });

  it('ignores unknown or missing slugs', () => {
    expect(getRecipe('nope')).toBeUndefined();
    expect(getRecipe('../../etc')).toBeUndefined();
    expect(getRecipe(null)).toBeUndefined();
    expect(getRecipe(undefined)).toBeUndefined();
  });
});

describe('isRecipeInDashboard', () => {
  it('matches only when both the event and the title match', () => {
    expect(
      isRecipeInDashboard(shipPullRequests, [
        { event: 'pull_request.opened', taskTitle: 'Opened a pull request' },
      ]),
    ).toBe(true);
    expect(
      isRecipeInDashboard(shipPullRequests, [
        { event: 'pull_request.opened', taskTitle: 'Something else' },
        { event: 'push', taskTitle: 'Opened a pull request' },
      ]),
    ).toBe(false);
  });
});

describe('recipeToTriggerValues', () => {
  it('pre-selects the repository when there is exactly one', () => {
    expect(
      recipeToTriggerValues(shipPullRequests, ['u1']).repositories,
    ).toEqual(['u1']);
  });

  it('leaves repositories empty when there are none or several', () => {
    expect(recipeToTriggerValues(shipPullRequests, []).repositories).toEqual(
      [],
    );
    expect(
      recipeToTriggerValues(shipPullRequests, ['u1', 'u2']).repositories,
    ).toEqual([]);
  });

  it('fills every other field from the recipe', () => {
    expect(recipeToTriggerValues(shipPullRequests, [])).toEqual({
      event: 'pull_request.opened',
      repositories: [],
      scoreDirection: 'up',
      taskAlias: '',
      taskAttribute: 'str',
      taskFrequency: 'weekly',
      taskNote: '',
      taskPriority: 1,
      taskTags: '',
      taskTitle: 'Opened a pull request',
    });
  });
});
